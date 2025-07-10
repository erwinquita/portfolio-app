<!-- src/routes/admin/logout/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { signOut } from '$lib/auth/client';
  import { toast } from 'svelte-sonner';
  
  let isLoggingOut = $state(true);
  let error = $state(null);

  onMount(async () => {
    await handleLogout();
  });

  async function handleLogout() {
    try {
      isLoggingOut = true;
      error = null;
      
      // Sign out using better-auth
      const result = await signOut();
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Clear any additional client-side storage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth-session');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      
      toast.success('Successfully logged out!');
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        goto('/admin/login', { replaceState: true });
      }, 1000);
      
    } catch (err) {
      console.error('Logout error:', err);
      error = err.message || 'Failed to logout';
      toast.error('Logout failed. Redirecting to login page...');
      
      // Even if logout fails, redirect to login page
      setTimeout(() => {
        goto('/admin/login', { replaceState: true });
      }, 2000);
    } finally {
      isLoggingOut = false;
    }
  }

  function goToLogin() {
    goto('/admin/login');
  }
</script>

<svelte:head>
  <title>Logging Out - Admin</title>
</svelte:head>

<div class="logout-container">
  <div class="logout-card">
    {#if isLoggingOut}
      <div class="logout-progress">
        <div class="spinner"></div>
        <h2>Logging out...</h2>
        <p>Please wait while we securely sign you out.</p>
      </div>
    {:else if error}
      <div class="logout-error">
        <div class="error-icon">⚠️</div>
        <h2>Logout Error</h2>
        <p>There was an issue logging you out: {error}</p>
        <p>You will be redirected to the login page shortly.</p>
        <button class="button primary" onclick={goToLogin}>
          Go to Login Now
        </button>
      </div>
    {:else}
      <div class="logout-success">
        <div class="success-icon">✅</div>
        <h2>Successfully Logged Out</h2>
        <p>You have been securely signed out.</p>
        <p>Redirecting to login page...</p>
        <button class="button primary" onclick={goToLogin}>
          Go to Login
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .logout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
  }

  .logout-card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .logout-progress,
  .logout-error,
  .logout-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-icon,
  .success-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }

  h2 {
    margin: 0;
    color: #333;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    margin-top: 10px;
  }

  .button.primary {
    background-color: #007bff;
    color: white;
  }

  .button.primary:hover {
    background-color: #0056b3;
  }
</style>
