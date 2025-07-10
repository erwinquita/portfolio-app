import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()]
});

// // vite.config.ts
// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';
//
// export default defineConfig({
//   plugins: [sveltekit()],
//   server: {
//     port: 5174,
//     host: true,
//   },
//   preview: {
//     port: 5174,
//   },
//   optimizeDeps: {
//     include: ['better-auth/client', 'better-auth']
//   }

