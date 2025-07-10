// src/routes/api/auth/[...auth]/+server.ts
import { auth } from '$lib/auth/server';
import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async (request) => {
export const GET: RequestHandler = async (event) => {
	// return auth.handler(request);
	return auth.handler(event.request);
};

// export const POST: RequestHandler = async (request) => {
export const POST: RequestHandler = async (event) => {
	// return auth.handler(request);
	return auth.handler(event.request);
};


// src/routes/api/auth/[...auth]/+server.ts
// import { auth } from '$lib/auth/server';
// import type { RequestHandler } from './$types';
//
// export const GET: RequestHandler = async ({ request }) => {
// 	return auth.handler(request);
// };
//
// export const POST: RequestHandler = async ({ request }) => {
// 	return auth.handler(request);
// };
//
// export const PUT: RequestHandler = async ({ request }) => {
// 	return auth.handler(request);
// };
//
// export const DELETE: RequestHandler = async ({ request }) => {
// 	return auth.handler(request);
// };
//
// export const PATCH: RequestHandler = async ({ request }) => {
// 	return auth.handler(request);
// };
//
// // Handle OPTIONS for CORS
// export const OPTIONS: RequestHandler = async ({ request }) => {
// 	return auth.handler(request);
// };


