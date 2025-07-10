<script lang="ts">
  import { enhance } from '$app/forms';
  
  // Props
  let {
    mode = 'create',
    category = null,
    onSubmit,
    onCancel,
    onEdit,
    hasChanges = $bindable(false),
    submitDisabled = $bindable(true),
    resetDisabled = $bindable(true),
    isSubmitting = $bindable(false)
  } = $props();
  
  // Form state
  let formData = $state({
    id: category?.id || '',
    category: category?.category || ''
  });
  
  let originalData = $state({
    category: category?.category || ''
  });
  
  // Update form data when category prop changes
  $effect(() => {
    if (category) {
      formData = {
        id: category.id || '',
        category: category.category || ''
      };
      originalData = {
        category: category.category || ''
      };
    } else {
      formData = {
        id: '',
        category: ''
      };
      originalData = {
        category: ''
      };
    }
  });
  
  // Check for changes and validate form
  $effect(() => {
    const changed = formData.category !== originalData.category;
    const valid = formData.category.trim() !== '';
    
    hasChanges = changed;
    submitDisabled = !valid || !changed || isSubmitting;
    resetDisabled = !changed || isSubmitting;
  });
  
  function handleReset() {
    formData.category = originalData.category;
    // formData.description = originalData.description;
  }
  
  function handleEditClick() {
    if (onEdit) {
      onEdit(category);
    }
  }
  
  function handleSubmitClick(event) {
    event.preventDefault();
    
    if (submitDisabled) return;
    
    // Create FormData object
    const formDataObj = new FormData();
    formDataObj.append('category', formData.category.trim());
    // formDataObj.append('description', formData.description.trim());
    
    if (mode === 'edit' && formData.id) {
      formDataObj.append('id', formData.id);
    }
    
    // Call parent's onSubmit function
    if (onSubmit) {
      onSubmit(formDataObj, formData);
    }
    
    // Submit the form using SvelteKit's enhance
    const form = event.target.closest('form');
    if (form) {
      form.requestSubmit();
    }
  }
</script>

<form 
  method="POST" 
  action={mode === 'create' ? '?/createCategory' : '?/updateCategory'}
  use:enhance={() => {
    isSubmitting = true; // isSubmitting will be reset in the parents effect
    return async ({ update }) => {
      await update();
    };
  }}
>
  <!-- Hidden ID field for edit mode -->
  {#if mode === 'edit' && formData.id}
    <input type="hidden" name="id" value={formData.id} />
  {/if}
  
  <div class="form-group">
    <label for="category">Category Name</label>
    <input
      type="text"
      id="category"
      name="category"
      bind:value={formData.category}
      disabled={mode === 'view' || isSubmitting}
      placeholder="Enter category name"
      required
    />
  </div>
  
  <div class="form-actions">
    {#if mode === 'view'}
      <button type="button" class="button" onclick={handleEditClick}>
        Edit Category
      </button>
      <button type="button" class="button secondary" onclick={onCancel}>
        Close
      </button>
    {:else}
      <button type="button" class="button secondary" onclick={onCancel}>
        Cancel
      </button>
      
      {#if hasChanges}
        <button 
          type="button" 
          class="button secondary" 
          onclick={handleReset}
          disabled={resetDisabled}
        >
          Reset
        </button>
      {/if}
      
      <button 
        type="submit" 
        class="button primary"
        onclick={handleSubmitClick}
        disabled={submitDisabled}
      >
        {#if isSubmitting}
          {mode === 'create' ? 'Adding...' : 'Updating...'}
        {:else}
          {mode === 'create' ? 'Add Category' : 'Update Category'}
        {/if}
      </button>
    {/if}
  </div>
</form>

<style>
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-group input:disabled {
    cursor: not-allowed;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .button.primary {
    background: #3b82f6;
    color: white;
  }
  
  .button.primary:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .button.secondary {
    background: #6b7280;
    color: white;
  }
  
  .button.secondary:hover:not(:disabled) {
    background: #4b5563;
    transform: translateY(-1px);
  }
  
  .button:hover:not(:disabled) {
    transform: translateY(-1px);
  }
</style>
