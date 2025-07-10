<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	
	interface ToastProps {
		id: string;
		type: 'success' | 'error' | 'warning' | 'info';
		message: string;
		duration?: number;
		dismissible?: boolean;
		onRemove: (id: string) => void;
	}
	
	let {
		id,
		type = 'info',
		message,
		duration = 5000,
		dismissible = true,
		onRemove
	}: ToastProps = $props();
	
	let element: HTMLDivElement;
	let timeoutId: number | undefined;
	// let progressElement: HTMLDivElement;
	let removing = $state(false);
	
	const icons = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	};
	
	function dismiss() {
		if (removing) return;
		
		removing = true;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		
		// Wait for animation to complete before removing
		setTimeout(() => {
			onRemove(id);
		}, 300);
	}
	
	onMount(() => {
		if (duration > 0) {
			timeoutId = setTimeout(dismiss, duration);
		}
	});
	
	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});
</script>

<div
	bind:this={element}
	class="toast-item"
	class:removing
	role="alert"
	aria-live="polite"
>
	<div class="toast-content {type}">
		<span class="toast-icon">{icons[type]}</span>
		<span class="toast-message">{message}</span>
		{#if dismissible}
			<button class="toast-close" onclick={dismiss} aria-label="Close notification">
				×
			</button>
		{/if}
		{#if duration > 0}
			<div
				class="toast-progress"
			></div>
		{/if}
	</div>
</div>

<style>

/* Toast Item Styles */
.toast-item {
	margin-bottom: var(--size-2);
	pointer-events: auto;
	animation: toast-slide-in 0.3s ease-out;
}

.toast-item.removing {
	animation: toast-slide-out 0.3s ease-out forwards;
}

/* Toast Content Styles */
.toast-content {
	background: var(--portfolio-surface);
	color: var(--portfolio-text);
	padding: var(--size-3) var(--size-4);
	border-radius: var(--radius-2);
	box-shadow: var(--shadow-3);
	border: var(--border-size-1) solid var(--gray-3);
	min-width: 300px;
	max-width: 400px;
	display: flex;
	align-items: center;
	gap: var(--size-2);
}

/* Toast Type Variants */
.toast-content.success {
	background: var(--green-1);
	border-color: var(--green-4);
	color: var(--green-9);
}

.toast-content.error {
	background: var(--red-1);
	border-color: var(--red-4);
	color: var(--red-9);
}

.toast-content.warning {
	background: var(--orange-1);
	border-color: var(--orange-4);
	color: var(--orange-9);
}

.toast-content.info {
	background: var(--blue-1);
	border-color: var(--blue-4);
	color: var(--blue-9);
}

/* Dark Mode Adjustments */
@media (prefers-color-scheme: dark) {
	.toast-content {
		background: var(--gray-8);
		border-color: var(--gray-6);
	}

	.toast-content.success {
		background: var(--green-9);
		border-color: var(--green-6);
		color: var(--green-1);
	}

	.toast-content.error {
		background: var(--red-9);
		border-color: var(--red-6);
		color: var(--red-1);
	}

	.toast-content.warning {
		background: var(--orange-9);
		border-color: var(--orange-6);
		color: var(--orange-1);
	}

	.toast-content.info {
		background: var(--blue-9);
		border-color: var(--blue-6);
		color: var(--blue-1);
	}
}

/* Toast Icon */
.toast-icon {
	font-size: var(--font-size-2);
	font-weight: var(--font-weight-7);
	flex-shrink: 0;
}

/* Toast Message */
.toast-message {
	flex: 1;
	font-size: var(--font-size-1);
	line-height: var(--font-lineheight-2);
}

/* Toast Close Button */
.toast-close {
	background: none;
	border: none;
	color: inherit;
	cursor: pointer;
	padding: var(--size-1);
	border-radius: var(--radius-1);
	opacity: 0.7;
	flex-shrink: 0;
	font-size: var(--font-size-1);
	line-height: 1;
}

.toast-close:hover {
	opacity: 1;
	background: rgba(0, 0, 0, 0.1);
}

/* Toast Progress Bar */
.toast-progress {
	position: absolute;
	bottom: 0;
	left: 0;
	height: 3px;
	background: currentColor;
	opacity: 0.3;
	border-radius: 0 0 var(--radius-2) var(--radius-2);
	animation: toast-progress var(--duration, 5000ms) linear forwards;
}

/* Animations */
@keyframes toast-slide-in {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

@keyframes toast-slide-out {
	from {
		transform: translateX(0);
		opacity: 1;
	}
	to {
		transform: translateX(100%);
		opacity: 0;
	}
}

@keyframes toast-progress {
	from {
		width: 100%;
	}
	to {
		width: 0%;
	}
}

/* Mobile Responsive */
@media (max-width: 768px) {
	.toast-container {
		top: var(--size-2);
		right: var(--size-2);
		left: var(--size-2);
	}

	.toast-content {
		min-width: auto;
		max-width: none;
	}
}
</style>
