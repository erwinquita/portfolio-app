<!-- src/routes/admin/login/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { auth, signOut, getSession } from '$lib/auth/client';
  // import { auth, signOut, getSession } from '$lib';
  import { toast } from 'svelte-sonner';
  
  let isLoading = $state(true);
  let isLoggedIn = $state(false);
  let currentUser = $state(null);
  let isSigningIn = $state(false);

  onMount(async () => {
    await checkAuthStatus();
  });

  async function checkAuthStatus() {
    try {
      // First check if we're on the client side
      if (typeof window === 'undefined') return;
      
      const session = await getSession();
      console.log(session, 'testing');
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

  async function handleGoogleSignIn() {
    try {
      isSigningIn = true;
      
      // Use better-auth's Google sign-in
      const result = await auth.signIn.social({
        provider: 'google',
        callbackURL: '/admin/portfolio'
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Success will be handled by the redirect
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      if (error.message?.includes('fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        toast.error('Unable to connect to authentication service. Please check if the server is running.');
      } else {
        toast.error('Sign in failed. Please try again.');
      }
      
      isSigningIn = false;
    }
  }

  async function handleSignOut() {
    try {
      const result = await signOut();
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      isLoggedIn = false;
      currentUser = null;
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed. Please try again.');
    }
  }

  function goToAdmin() {
    goto('/admin');
  }
</script>

<svelte:head>
  <title>Admin Login</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <h1>Admin Login</h1>
    
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    {:else if isLoggedIn && currentUser}
      <!-- User is already logged in -->
      <div class="user-info">
        {#if currentUser.image}
          <img src={currentUser.image} alt={currentUser.name} class="user-avatar" />
        {:else}
          <div class="user-avatar-placeholder">
            {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        {/if}
        <h2>Welcome back, {currentUser.name}!</h2>
        <p>You are currently signed in.</p>
        
        <div class="actions">
          <button class="button primary" onclick={goToAdmin}>
            Go to Admin Dashboard
          </button>
          <button class="button secondary" onclick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    {:else}
      <!-- User is not logged in - show Google login -->
      <div class="login-form">
        <p>Please sign in to access the admin dashboard.</p>
        
        <button 
          class="button google-signin" 
          onclick={handleGoogleSignIn}
        >
          {#if isSigningIn}
            <div class="spinner small"></div>
            <span>Signing in...</span>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          {/if}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
  }

  .login-card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .login-card h1 {
    margin-bottom: 30px;
    color: #333;
  }

  .loading {
    padding: 20px;
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

  .spinner.small {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .user-info {
    text-align: center;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 15px;
  }

  .user-avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 500;
    margin: 0 auto 15px;
  }

  .user-info h2 {
    margin-bottom: 10px;
    color: #333;
  }

  .user-info p {
    color: #666;
    margin-bottom: 30px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .login-form p {
    margin-bottom: 30px;
    color: #666;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    width: 100%;
  }

  .button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button.primary {
    background-color: #007bff;
    color: white;
  }

  .button.primary:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .button.secondary {
    background-color: #6c757d;
    color: white;
  }

  .button.secondary:hover:not(:disabled) {
    background-color: #545b62;
  }

  .button.google-signin {
    background-color: white;
    color: #333;
    border: 1px solid #ddd;
  }

  .button.google-signin:hover:not(:disabled) {
    background-color: #f8f9fa;
    border-color: #ccc;
  }

  .button.google-signin svg {
    flex-shrink: 0;
  }
</style>
