<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import { toastStore } from '$lib/stores/toast';
  import { invalidateAll } from '$app/navigation';
  import Dialog from '$lib/components/Dialog.svelte';
  import CategoryForm from '$lib/components/forms/CategoryForm.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
  
  let isSubmitting = $state(false);
  let categories = $state(data.categories || []);
  
  // Dialog state
  let categoryDialog = $state(false);
  let deleteDialog = $state(false);
  
  // Category state
  let currentCategory = $state(null);
  let deletingCategory = $state(null);
  let categoryMode = $state('create'); // 'create', 'edit', or 'view'
  
  // Form state
  let formChanges = $state(false);
  let formDisabled = $state(true);
  let resetDisabled = $state(true);
  
  // Track processed form results to prevent duplicate toasts
  let processedFormResult = $state<string | null>(null);

  // Update categories when data changes
  $effect(() => {
    categories = data.categories || [];
  });

  // Show toast messages based on form result - with deduplication
  $effect(() => {
    if (form?.success && form?.action) {
      // Create a unique key for this form result based on timestamp and action
      const formKey = `${form.action}-${form.success}-${form.timestamp || Date.now()}`;
      
      // Only process if we haven't seen this exact result before
      if (processedFormResult !== formKey) {
        processedFormResult = formKey;
        
        if (form.action === 'createCategory') {
          toastStore.success('Category added successfully!');
          closeDialogs();
        } else if (form.action === 'updateCategory') {
          toastStore.success('Category updated successfully!');
          closeDialogs();
        } else if (form.action === 'deleteCategory') {
          toastStore.success('Category deleted successfully!');
          closeDialogs();
        }
        
        // Reset submitting state
        isSubmitting = false;
      }
    } else if (form?.error) {
      // Create a unique key for error messages too
      const errorKey = `error-${form.error}-${form.timestamp || Date.now()}`;
      
      if (processedFormResult !== errorKey) {
        processedFormResult = errorKey;
        toastStore.error(form.error);
        // Reset submitting state on error
        isSubmitting = false;
      }
    }
  });

  function openCreateDialog() {
    currentCategory = null;
    categoryMode = 'create';
    categoryDialog = true;
  }
  
  function openEditDialog(category) {
    currentCategory = category;
    categoryMode = 'edit';
    categoryDialog = true;
  }
  
  function openViewDialog(category) {
    currentCategory = category;
    categoryMode = 'view';
    categoryDialog = true;
  }
  
  function openDeleteDialog(category) {
    deletingCategory = category;
    deleteDialog = true;
  }
  
  function closeDialogs() {
    categoryDialog = false;
    deleteDialog = false;
    currentCategory = null;
    deletingCategory = null;
    formChanges = false;
    formDisabled = true;
    resetDisabled = true;
    categoryMode = 'create';
    isSubmitting = false; // Reset submitting state when closing dialogs
  }
  
  function handleEditFromView(category) {
    // Switch from view mode to edit mode
    categoryMode = 'edit';
    currentCategory = category;
  }
  
  // Form submit handlers
  function handleCategorySubmit(formData, formDataObj) {
    // This function is called by CategoryForm before the actual form submission
    // We can perform any pre-submission logic here
    isSubmitting = true;
    
    // Optional: You can also validate or modify the form data here
    console.log('Submitting category:', formDataObj);
    // $state.snapshot(formDataObj);
  }
  
  // Computed properties for dialog title
  let dialogTitle = $derived(
    categoryMode === 'create' ? 'Add New Category' :
    categoryMode === 'edit' ? 'Edit Category' :
    'Category Details'
  );
</script>

<svelte:head>
  <title>Admin - Category Management</title>
  <meta name="description" content="Manage categories" />
</svelte:head>

<section class="section">
  <div class="container">
    <h1 class="mb-4">Category Admin</h1>
    
    <div class="section-header">
      <h2>Categories</h2>
      <button class="button" onclick={openCreateDialog}>
        Add New Category
      </button>
    </div>

    <!-- Categories List -->
    {#if categories.length > 0}
      <div class="categories-grid">
        {#each categories as category}
          <div class="category-card">
            <h3>{category.category}</h3>
            <p class="category-date">
              Created: {new Date(category.createdAt || '').toLocaleDateString()}
            </p>
            <div class="category-actions">
              <button 
                class="button-small"
                onclick={() => openViewDialog(category)}
              >
                View
              </button>
              <button 
                class="button-small"
                onclick={() => openEditDialog(category)}
              >
                Edit
              </button>
              <button 
                class="button-small button-danger"
                onclick={() => openDeleteDialog(category)}
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <p>No categories yet. Add your first category!</p>
      </div>
    {/if}
  </div>
</section>

<!-- Category Dialog (Create/Edit/View) -->
<Dialog title={dialogTitle} bind:isOpen={categoryDialog} onClose={closeDialogs}>
  <CategoryForm
    mode={categoryMode}
    category={currentCategory}
    onSubmit={handleCategorySubmit}
    onCancel={closeDialogs}
    onEdit={handleEditFromView}
    bind:hasChanges={formChanges}
    bind:submitDisabled={formDisabled}
    bind:resetDisabled={resetDisabled}
    bind:isSubmitting={isSubmitting}
  />
</Dialog>

<!-- Delete Confirmation Dialog -->
<Dialog title="Confirm Delete" bind:isOpen={deleteDialog} onClose={closeDialogs}>
  <div class="delete-confirmation">
    <p>
      Are you sure you want to delete this category? 
      <strong>"{deletingCategory?.category}"</strong>
    </p>
    <p>This action cannot be undone.</p>
    
    <div class="dialog-actions">
      <button 
        type="button" 
        class="button secondary"
        onclick={closeDialogs}
      >
        Cancel
      </button>
      <form
        method="POST"
        action="?/deleteCategory"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ update }) => {
            isSubmitting = false;
            await update();
          };
        }}
      >
        <input type="hidden" name="id" value={deletingCategory?.id} />
        <button type="submit" class="button button-danger" disabled={isSubmitting}>
          {isSubmitting ? 'Deleting...' : 'Delete Category'}
        </button>
      </form>
    </div>
  </div>
</Dialog>

<style>
  .section {
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .category-card {
    transition: box-shadow 0.2s;
  }

  .category-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .category-card h3 {
    margin: 0 0 1rem 0;
  }

  .category-date {
    margin: 1rem 0;
  }

  .category-actions {
    display: flex;
    gap: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
  }

  .dialog-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .button:hover:not(:disabled) {
    background: #2563eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button.secondary:hover:not(:disabled) {
    background: #4b5563;
  }

  .button-danger:hover:not(:disabled) {
    background: #b91c1c;
  }
</style>
