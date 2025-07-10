<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { auth } from '$lib/auth/client';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children, data } = $props();

	const navItems = [
		{ href: '/about', label: 'About' },
		{ href: '/portfolio', label: 'Portfolio' },
		{ href: '/contact', label: 'Contact' }
	];

	// Handle Google sign in
	async function handleGoogleSignIn() {
		try {
			await auth.signIn.social({
				provider: 'google',
				callbackURL: '/'
			});
		} catch (error) {
			console.error('Sign in error:', error);
		}
	}

	// Handle sign out
	async function handleSignOut() {
		try {
			await auth.signOut();
			window.location.reload();
		} catch (error) {
			console.error('Sign out error:', error);
		}
	}
</script>

<nav class="nav">
	<ul class="nav-list">
		<li>
			<a href="/" class="nav-link" style="font-weight: var(--font-weight-7);">Home</a>
		</li>
		{#each navItems as item}
			<li>
				<a href={item.href} class="nav-link" class:active={$page.url.pathname === item.href}>
					{item.label}
				</a>
			</li>
		{/each}
		{#if data.user}
			<li>
				<a href="/admin/portfolio">Admin</a>
			</li>
			<li>
				<div class="user-info">
					<img src={data.user.image} alt={data.user.name} class="user-avatar" />
					<div class="user-details">
						<h2 class="user-name">{data.user.name}!</h2>
						<span class="user-email">{data.user.email}</span>
					</div>
				</div>
				<div class="user-actions">
					<button class="btn btn-secondary" onclick={handleSignOut}>Sign Out</button>
				</div>
			</li>
		{:else}
			<li>
				<button class="btn btn-primary" onclick={handleGoogleSignIn}> Sign in with Google </button>
			</li>
		{/if}
	</ul>
</nav>

<!-- User Info Section -->
<main>
	{@render children()}
</main>

<footer class="section" style="background: var(--portfolio-surface); margin-top: var(--size-8);">
	<div class="container text-center">
		<p>&copy; 2025 Portfolio App. Built with SvelteKit & Open Props.</p>
	</div>
</footer>

<!-- Toast Container -->
<ToastContainer />

<style>
	.user-welcome-section {
		background: var(--portfolio-surface, #f8f9fa);
		border-bottom: 1px solid #e0e0e0;
		padding: 16px 0;
	}

	.user-welcome-section .container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.user-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.user-details {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.user-name {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: #333;
	}

	.user-email {
		font-size: 13px;
		color: #666;
		font-weight: 400;
	}

	.user-actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.auth-section {
		background: var(--portfolio-surface, #f8f9fa);
		border-bottom: 1px solid #e0e0e0;
		padding: 20px 0;
	}

	.auth-content {
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.auth-content h2 {
		margin: 0 0 8px 0;
		font-size: 20px;
		font-weight: 600;
		color: #333;
	}

	.auth-content p {
		margin: 0 0 16px 0;
		color: #666;
		font-size: 14px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border-radius: 6px;
		font-weight: 500;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 14px;
	}

	.btn-primary {
		background-color: #007bff;
		color: white;
	}

	.btn-primary:hover {
		background-color: #0056b3;
	}

	.btn-secondary {
		background-color: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background-color: #545b62;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.user-welcome-section .container {
			flex-direction: column;
			gap: 16px;
			text-align: center;
		}

		.user-info {
			flex-direction: column;
			text-align: center;
			gap: 8px;
		}

		.user-details {
			align-items: center;
		}

		.user-actions {
			flex-direction: column;
			width: 100%;
		}

		.user-actions .btn {
			width: 100%;
		}

		.auth-section {
			padding: 16px 0;
		}

		.auth-content h2 {
			font-size: 18px;
		}

		.auth-content p {
			font-size: 13px;
		}
	}
</style>
