// src/routes/admin/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url }) => {
  // Get session from auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Allow access to login and logout pages without authentication
  const publicAdminPaths = ['/admin/login', '/admin/logout'];
  const isPublicPath = publicAdminPaths.includes(url.pathname);

  // If no session and trying to access protected admin routes, redirect to login
  if (!session?.user && !isPublicPath) {
    throw redirect(302, '/admin/login');
  }

  // If user is logged in and trying to access login page, redirect to admin dashboard
  if (session?.user && url.pathname === '/admin/login') {
    throw redirect(302, '/admin/portfolio');
  }

  return {
    session,
    user: session?.user || null,
  };
};
