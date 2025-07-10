// +page.server.ts
import { db } from '$lib/db/server';
import { portfolios, user, categories } from '$lib/db/server/schema';
import { eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/auth/server';

export async function load({ request }) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const [portfolioData, usersData, categoriesData] = await Promise.all([
      db
        .select({
          id: portfolios.id,
          title: portfolios.title,
          description: portfolios.description,
          imageUrl: portfolios.imageUrl,
          projectUrl: portfolios.projectUrl,
          tags: portfolios.tags,
          userId: portfolios.userId,
          categoryId: portfolios.categoryId,
          createdAt: portfolios.createdAt,
          updatedAt: portfolios.updatedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          category: {
            id: categories.id,
            category: categories.category
          }
        })
        .from(portfolios)
        .leftJoin(user, eq(portfolios.userId, user.id))
        .leftJoin(categories, eq(portfolios.categoryId, categories.id))
        .orderBy(portfolios.createdAt),
      
      db.select().from(user),
      db.select().from(categories)
    ]);

    return {
      portfolios: portfolioData,
      user: usersData,
      categories: categoriesData,
      session,
      currentUser: session?.user || null
    };
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return {
      portfolios: [],
      user: [],
      categories: [],
      session: null,
      currentUser: null
    };
  }
}
