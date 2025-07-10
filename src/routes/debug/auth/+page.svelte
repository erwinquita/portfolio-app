<!-- src/routes/debug/auth/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth/client';
  
  let debugInfo = $state({
    baseURL: '',
    endpoints: [],
    sessionStatus: 'checking...',
    error: null
  });

  onMount(async () => {
    // Get the base URL being used
    debugInfo.baseURL = auth.options?.baseURL || 'Not set';
    
    // Test different endpoints
    const endpoints = [
      '/api/auth/session',
      '/api/auth/get-session',
      '/api/auth/providers',
      '/api/auth/csrf'
    ];
    
    debugInfo.endpoints = [];
    
    for (const endpoint of endpoints) {
      try {
        const fullUrl = `${window.location.origin}${endpoint}`;
        const response = await fetch(fullUrl, {
          method: 'GET',
          credentials: 'include'
        });
        
        debugInfo.endpoints.push({
          endpoint,
          status: response.status,
          ok: response.ok,
          url: fullUrl
        });
      } catch (error) {
        debugInfo.endpoints.push({
          endpoint,
          status: 'ERROR',
          ok: false,
          error: error.message,
          url: `${window.location.origin}${endpoint}`
        });
      }
    }
    
    // Test session
    try {
      const session = await auth.getSession();
      debugInfo.sessionStatus = session ? 'Found session' : 'No session';
    } catch (error) {
      debugInfo.sessionStatus = 'Error getting session';
      debugInfo.error = error.message;
    }
  });
</script>

<svelte:head>
  <title>Auth Debug</title>
</svelte:head>

<div class="debug-container">
  <h1>Authentication Debug Information</h1>
  
  <div class="debug-section">
    <h2>Client Configuration</h2>
    <p><strong>Base URL:</strong> {debugInfo.baseURL}</p>
    <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</p>
  </div>
  
  <div class="debug-section">
    <h2>Session Status</h2>
    <p><strong>Status:</strong> {debugInfo.sessionStatus}</p>
    {#if debugInfo.error}
      <p><strong>Error:</strong> <code>{debugInfo.error}</code></p>
    {/if}
  </div>
  
  <div class="debug-section">
    <h2>Endpoint Tests</h2>
    {#each debugInfo.endpoints as endpoint}
      <div class="endpoint-test">
        <p><strong>Endpoint:</strong> {endpoint.endpoint}</p>
        <p><strong>Full URL:</strong> {endpoint.url}</p>
        <p><strong>Status:</strong> 
          <span class={endpoint.ok ? 'success' : 'error'}>
            {endpoint.status}
          </span>
        </p>
        {#if endpoint.error}
          <p><strong>Error:</strong> <code>{endpoint.error}</code></p>
        {/if}
      </div>
    {/each}
  </div>
  
  <div class="debug-section">
    <h2>Manual Tests</h2>
    <button onclick={() => window.location.href = '/api/auth/session'}>
      Test /api/auth/session
    </button>
    <button onclick={() => window.location.href = '/api/auth/providers'}>
      Test /api/auth/providers
    </button>
  </div>
</div>

<style>
  .debug-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .debug-section {
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .debug-section h2 {
    margin-top: 0;
  }
  
  .endpoint-test {
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .endpoint-test p {
    margin: 0.25rem 0;
  }
  
  .success {
    color: #28a745;
    font-weight: bold;
  }
  
  .error {
    color: #dc3545;
    font-weight: bold;
  }
  
  code {
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  button:hover {
    background: #0056b3;
  }
</style>
