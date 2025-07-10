import { db } from '$lib/db/server';
import { portfolios } from '$lib/db/server/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const projects = await db
			.select()
			.from(portfolios)
			.orderBy(desc(portfolios.createdAt));

		return {
			projects
		};
	} catch (error) {
		console.error('Error loading portfolio projects:', error);
		return {
			projects: []
		};
	}
};
