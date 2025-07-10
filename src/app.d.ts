// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// src/app.d.ts
import type { User, Session } from '$lib/auth/server';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
}
export {};
