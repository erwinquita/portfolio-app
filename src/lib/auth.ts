import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/db/server';
import { BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  secret: BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
   cookieCache: {
    enabled: true
   }
  },
});

// import { createAuthClient } from 'better-auth/svelte';
// import type { auth } from '$lib/auth/server';
// import { inferAdditionalFields } from 'better-auth/client/plugins';
//
// export const authClient = (url: string) => {
// 	return createAuthClient({
// 		baseURL: url,
// 		plugins: [inferAdditionalFields<auth>()]
// 	});
// };
