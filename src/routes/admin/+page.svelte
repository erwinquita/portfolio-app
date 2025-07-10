<script>
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  // import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { auth, signOut, getSession } from '$lib/auth/client'; // Import better-auth client
  
  let { data } = $props();
  
  let createDialog = $state(null);
  let editDialog = $state(null);
  let deleteDialog = $state(null);
  
  let editingPortfolio = $state(null);
  let deletingPortfolio = $state(null);
  
  let isEditing = $state(false);
  let originalFormData = $state({});
  let isLoggingOut = $state(false);
  let isCheckingSession = $state(true);
  let currentUser = $state(null);

  // Check session on component mount and periodically
  onMount(() => {
    checkSession();
    
    // Check session every 30 seconds
    const interval = setInterval(checkSession, 90000);
    
    return () => clearInterval(interval);
  });

  async function checkAuthStatus() {
    try {
      // First check if we're on the client side
      if (typeof window === 'undefined') return;
      
      const session = await getSession();
      
      if (session?.user) {
        isLoggedIn = true;
        currentUser = session.user;
        // If user is already logged in, redirect to admin page
        goto('/admin/portfolio');
      } else {
        isLoggedIn = false;
        currentUser = null;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      isLoggedIn = false;
      currentUser = null;
      
      // If it's a connection error, show a helpful message
      if (error.message?.includes('fetch')) {
        toast.error('Unable to connect to authentication service. Please check if the server is running.');
      }
    } finally {
      isLoading = false;
    }
  }

  async function checkSession() {
    try {
      const session = await getSession();
      
      if (!session || !session.user) {
        // Clear any existing session data
        await clearSessionAndRedirect();
        return;
      }
      
      currentUser = session.user;
      isCheckingSession = false;
      console.log(currentUser);
    } catch (error) {
      console.error('Session check failed:', error);
      await clearSessionAndRedirect();
    }
  }

  async function clearSessionAndRedirect() {
    try {
      // Clear the session
      await signOut();
      // Clear local storage or any cached data
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth-session');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing session:', error);
    } finally {
      // Redirect to login page
      goto('/admin/login');
    }
  }
  
  async function handleLogout() {
    try {
      isLoggingOut = true;
      await signOut();
      toast.success('Logged out successfully');
      goto('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
      // Force redirect even if logout fails
      goto('/admin/login');
    } finally {
      isLoggingOut = false;
    }
  }
  
  let hasChanges = $state(false);
  
  function openCreateDialog() {
    createDialog?.showModal();
  }
  
  function openEditDialog(portfolio) {
    editingPortfolio = portfolio;
    originalFormData = {
      title: portfolio.title,
      description: portfolio.description,
      url: portfolio.url,
      userId: portfolio.userId,
      categoryId: portfolio.categoryId
    };
    isEditing = false;
    hasChanges = false;
    editDialog?.showModal();
  }
  
  function openDeleteDialog(portfolio) {
    deletingPortfolio = portfolio;
    deleteDialog?.showModal();
  }
  
  function closeDialogs() {
    createDialog?.close();
    editDialog?.close();
    deleteDialog?.close();
    editingPortfolio = null;
    deletingPortfolio = null;
    isEditing = false;
    originalFormData = {};
    hasChanges = false;
  }
  
  function checkForChanges(event) {
    const formData = new FormData(event.target.form);
    const currentData = {
      title: formData.get('title'),
      description: formData.get('description'),
      url: formData.get('url'),
      userId: parseInt(formData.get('userId')),
      categoryId: parseInt(formData.get('categoryId'))
    };
    
    hasChanges = Object.keys(originalFormData).some(key => 
      originalFormData[key] !== currentData[key]
    );
  }
  
  function handleEditSubmit(event) {
    if (!hasChanges) {
      event.preventDefault();
      return;
    }
  }
</script>

<svelte:head>
  <title>Admin - Portfolio Management</title>
</svelte:head>

{#if isCheckingSession}
  <div class="loading-container">
    <p>Checking session...</p>
  </div>
{:else}
  <div class="admin-page">
    <div class="admin-header">
      <div class="admin-title">
        <h1>Portfolio Management</h1>
        {#if currentUser}
          <div class="user-info">
            <img src={currentUser.image} alt={currentUser.name} class="user-avatar" />
            <span class="user-name">{currentUser.name}</span>
          </div>
        {/if}
      </div>
      <div class="admin-actions">
        <button class="button" onclick={openCreateDialog}>Add New Portfolio</button>
        <button 
          class="button secondary" 
          onclick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
    
    {#if data.portfolios.length === 0}
      <p>No portfolios found. Create your first portfolio to get started!</p>
    {:else}
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Creator</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each data.portfolios as portfolio}
            <tr>
              <td>{portfolio.title}</td>
              <td>{portfolio.category?.category || 'Uncategorized'}</td>
              <td>{portfolio.user?.name || 'Unknown'}</td>
              <td><a href={portfolio.url} target="_blank" rel="noopener noreferrer">View</a></td>
              <td class="table-actions">
                <button class="button secondary" onclick={() => openEditDialog(portfolio)}>Edit</button>
                <button class="button danger" onclick={() => openDeleteDialog(portfolio)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <!-- Create Portfolio Dialog -->
  <dialog bind:this={createDialog}>
    <h2>Add New Portfolio</h2>
    <form method="POST" action="?/create" use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          closeDialogs();
          await invalidateAll();
          toast.success('Portfolio created successfully!');
        } else if (result.type === 'failure') {
          toast.error('Failed to create portfolio. Please try again.');
        }
      };
    }}>
      <div class="form-group">
        <label for="create-title">Title</label>
        <input type="text" id="create-title" name="title" required />
      </div>
      
      <div class="form-group">
        <label for="create-description">Description</label>
        <textarea id="create-description" name="description" required></textarea>
      </div>
      
      <div class="form-group">
        <label for="create-url">URL</label>
        <input type="url" id="create-url" name="url" required />
      </div>
     
      <div class="form-group">
        <label for="create-user">Creator</label>
        <select id="create-user" name="userId" required>
          <option value="">Select a creator</option>
          {#each data.users as user}
            <option value={user.id} selected={currentUser && user.id === currentUser.id}>{user.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="create-category">Category</label>
        <select id="create-category" name="categoryId" required>
          <option value="">Select a category</option>
          {#each data.categories as category}
            <option value={category.id}>{category.category}</option>
          {/each}
        </select>
      </div>
      
      <div class="dialog-actions">
        <button type="button" class="button secondary" onclick={closeDialogs}>Cancel</button>
        <button type="submit" class="button">Create Portfolio</button>
      </div>
    </form>
  </dialog>

  <!-- Edit Portfolio Dialog -->
  <dialog bind:this={editDialog}>
    <h2>Edit Portfolio</h2>
    {#if editingPortfolio}
      <form method="POST" action="?/update" onsubmit={handleEditSubmit} use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            closeDialogs();
            await invalidateAll();
            toast.success('Portfolio updated successfully!');
          } else if (result.type === 'failure') {
            toast.error('Failed to update portfolio. Please try again.');
          }
        };
      }}>
        <input type="hidden" name="id" value={editingPortfolio.id} />
        
        <div class="form-group">
          <label for="edit-title">Title</label>
          <input type="text" id="edit-title" name="title" value={editingPortfolio.title} required oninput={checkForChanges} />
        </div>
        
        <div class="form-group">
          <label for="edit-description">Description</label>
          <textarea id="edit-description" name="description" required oninput={checkForChanges}>{editingPortfolio.description}</textarea>
        </div>
        
        <div class="form-group">
          <label for="edit-url">URL</label>
          <input type="url" id="edit-url" name="url" value={editingPortfolio.url} required oninput={checkForChanges} />
        </div>
        
        <div class="form-group">
          <label for="edit-user">Creator</label>
          <select id="edit-user" name="userId" required onchange={checkForChanges}>
            <option value="">Select a creator</option>
            {#each data.users as user}
              <option value={user.id} selected={user.id === editingPortfolio.userId}>{user.name}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-group">
          <label for="edit-category">Category</label>
          <select id="edit-category" name="categoryId" required onchange={checkForChanges}>
            <option value="">Select a category</option>
            {#each data.categories as category}
              <option value={category.id} selected={category.id === editingPortfolio.categoryId}>{category.category}</option>
            {/each}
          </select>
        </div>
        
        <div class="dialog-actions">
          <button type="button" class="button secondary" onclick={closeDialogs}>Cancel</button>
          <button type="submit" class="button" disabled={!hasChanges}>Update Portfolio</button>
        </div>
      </form>
    {/if}
  </dialog>

  <!-- Delete Portfolio Dialog -->
  <dialog bind:this={deleteDialog}>
    <h2>Delete Portfolio</h2>
    {#if deletingPortfolio}
      <p>Are you sure you want to delete "<strong>{deletingPortfolio.title}</strong>"?</p>
      <p>This action cannot be undone.</p>
      
      <form method="POST" action="?/delete" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            closeDialogs();
            await invalidateAll();
            toast.success('Portfolio deleted successfully!');
          } else if (result.type === 'failure') {
            toast.error('Failed to delete portfolio. Please try again.');
          }
        };
      }}>
        <input type="hidden" name="id" value={deletingPortfolio.id} />
        
        <div class="dialog-actions">
          <button type="button" class="button secondary" onclick={closeDialogs}>Cancel</button>
          <button type="submit" class="button danger">Delete Portfolio</button>
        </div>
      </form>
    {/if}
  </dialog>
{/if}

<style>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2em;
  }
</style>
