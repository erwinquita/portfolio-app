
<!-- src/routes/admin/+layout.svelte -->
<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  
  let { data, children } = $props();
  
  const publicPaths = ['/admin/login', '/admin/logout'];
  const isPublicPath = publicPaths.includes($page.url.pathname);
  
  function goToPortfolio() {
    goto('/admin/portfolio');
  }
  
  function goToLogout() {
    goto('/admin/logout');
  }
</script>

<div class="admin-layout">
  {#if !isPublicPath && data.user}
        <nav class="admin-menu">
          <a 
            href="/admin/portfolio" 
            class:active={$page.url.pathname === '/admin/portfolio'}
          >
            Portfolio
          </a>
          <a 
            href="/admin/category" 
            class:active={$page.url.pathname === '/admin/category'}
          >
            Category
          </a>
          <!-- Add more navigation links here as needed -->
        </nav>
    
    <!-- Main content area for protected pages -->
    <main class="admin-main">
      {@render children()}
    </main>
  {:else}
    <!-- Public pages (login, logout) without header -->
    <main class="admin-public">
      {@render children()}
    </main>
  {/if}
</div>

<style>
  .admin-layout {
    min-height: 100vh;
  }

  .admin-header {
    border-bottom: 1px solid #e0e0e0;
    padding: 0 20px;
  }

  .admin-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    height: 70px;
  }

  .admin-brand h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
    font-weight: 600;
  }

  .admin-menu {
    display: flex;
    gap: 30px;
  }

  .admin-user {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .user-name {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .user-email {
    font-size: 12px;
    color: #666;
  }

  .logout-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .logout-btn:hover {
    background-color: #545b62;
  }

  .admin-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
  }

  .admin-public {
    /* No specific styling needed for public pages */
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .admin-nav {
      flex-direction: column;
      height: auto;
      padding: 15px 0;
      gap: 15px;
    }

    .admin-menu {
      gap: 20px;
    }

    .user-info {
      flex-direction: column;
      text-align: center;
      gap: 5px;
    }

    .user-details {
      align-items: center;
    }

    .admin-main {
      padding: 20px 15px;
    }
  }
</style>
