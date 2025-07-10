<script>
  import { onMount } from 'svelte';
  
  let featuredPortfolios = $state([]);
  let loading = $state(true);
  
  onMount(async () => {
    try {
      const response = await fetch('/api/portfolio?limit=3');
      if (response.ok) {
        const data = await response.json();
        featuredPortfolios = data.portfolios;
      }
    } catch (error) {
      console.error('Error fetching featured portfolios:', error);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Admin - Portfolio Management</title>
</svelte:head>

<div class="container">
  <div class="text-center mb-4">
    <h1>Welcome to Portfolio App</h1>
    <p>
      Discover amazing portfolios and showcase your work
    </p>
    <div class="flex gap-4 justify-center">
      <a href="/portfolio" class="btn btn-primary">View All Portfolios</a>
      <a href="/admin/portfolio" class="btn">Manage Portfolios</a>
    </div>
  </div>
  
  {#if loading}
    <div class="text-center">
      <p>Loading featured portfolios...</p>
    </div>
  {:else if featuredPortfolios.length > 0}
    <section>
      <h2>Featured Portfolios</h2>
      <div>
        {#each featuredPortfolios as portfolio}
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">{portfolio.title}</h3>
              <small>{portfolio.category}</small>
            </div>
            <div class="card-content">
              <p>{portfolio.description}</p>
              <a href={portfolio.url} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                View Project
              </a>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {:else}
    <div class="text-center">
      <p style="color: var(--text-2);">No portfolios available yet. <a href="/admin">Add some!</a></p>
    </div>
  {/if}
</div>
