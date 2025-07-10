// src/lib/auth/server/index.ts (Server-side only)
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/db/server';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
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
  trustedOrigins: ['http://localhost:5174'],
  callbacks: {
    async signIn({ user, account }) {
      // Only allow Google sign-in
      if (account.provider !== 'google') {
        return false;
      }
      return true;
    },
  },
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
export type auth = typeof auth;


// // place files you want to import through the `$lib` alias in this folder.
// import { betterAuth } from 'better-auth';
// import { drizzleAdapter } from 'better-auth/adapters/drizzle';
// import { db } from '$lib/db/server';
// import { BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
//
// export const auth = betterAuth({
//   database: drizzleAdapter(db, {
//     provider: 'sqlite',
//   }),
//   secret: BETTER_AUTH_SECRET,
//   socialProviders: {
//     google: {
//       clientId: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//     },
//   },
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//   },
// });
//
// export type auth = typeof auth;

