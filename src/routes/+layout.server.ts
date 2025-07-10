// src/routes/+layout.server.ts
import { auth } from '$lib/auth/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
  // Get session from auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return {
    session,
    user: session?.user || null,
  };
};
