// src/lib/auth/client.ts
import { createAuthClient } from 'better-auth/client';
import { browser } from '$app/environment';

export const auth = createAuthClient({
  baseURL: browser ? window.location.origin : 'http://localhost:5174',
  fetchOptions: {
    onError: (context) => {
      console.error('Auth client error:', context);
    }
  }
});

// Export commonly used methods for convenience
export const signIn = auth.signIn;
export const signOut = auth.signOut;
export const signUp = auth.signUp;
export const getSession = auth.getSession;
export const useSession = auth.useSession;

// Re-export types for client-side use
export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  user: User;
};


// import { createAuthClient } from "better-auth/client"
// const authClient = createAuthClient()
//  
// await authClient.signIn.email({
//     email: "test@user.com",
//     password: "password1234"
// })
