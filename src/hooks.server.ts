// import { auth } from "$lib/auth/server"; // path to your auth file
// import { svelteKitHandler } from "better-auth/svelte-kit";
//  
// export async function handle({ event, resolve }) {
//     return svelteKitHandler({ event, resolve, auth });
// }


// src/hooks.server.ts
import { auth } from '$lib/auth/server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Handle auth routes
  if (event.url.pathname.startsWith('/api/auth')) {
    return auth.handler(event.request);
  }

  // Get session for other routes
  try {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    event.locals.session = session;
    event.locals.user = session?.user || null;
  } catch (error) {
    console.error('Error getting session:', error);
    event.locals.session = null;
    event.locals.user = null;
  }

  return resolve(event);
};
