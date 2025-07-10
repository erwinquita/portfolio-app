// +page.server.ts
import { db } from '$lib/db/server';
import { categories } from '$lib/db/server/schema';
import { eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function load() {
  try {
    const categoriesData = await db.select().from(categories);
    return {
      categories: categoriesData
    };
  } catch (error) {
    console.error('Error loading categories data:', error);
    return {
      categories: []
    };
  }
}

export const actions = {
  createCategory: async ({ request }) => {
    const data = await request.formData();
    const category = data.get('category') as string;

    if (!category) {
      return fail(400, { 
        error: 'Category is required',
        action: 'createCategory' 
      });
    }

    try {
      const [result] = await db.insert(categories).values({
        category,
        updatedAt: sql`(datetime('now'))`
      }).returning();

      return { 
        success: true, 
        category: result,
        action: 'createCategory'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return fail(500, { 
        error: 'Failed to create category',
        action: 'createCategory' 
      });
    }
  },

  updateCategory: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string);
    const category = data.get('category') as string;

    if (!id || !category) {
      return fail(400, { 
        error: 'ID and category are required',
        action: 'updateCategory' 
      });
    }

    try {
      const [result] = await db
        .update(categories)
        .set({
          category,
          updatedAt: sql`(datetime('now'))`
        })
        .where(eq(categories.id, id))
        .returning();

      return { 
        success: true, 
        category: result,
        action: 'updateCategory'
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return fail(500, { 
        error: 'Failed to update category',
        action: 'updateCategory' 
      });
    }
  },

  deleteCategory: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string);

    if (!id) {
      return fail(400, { 
        error: 'Category ID is required',
        action: 'deleteCategory' 
      });
    }

    try {
      await db.delete(categories).where(eq(categories.id, id));
      return { 
        success: true,
        action: 'deleteCategory'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return fail(500, { 
        error: 'Failed to delete category',
        action: 'deleteCategory' 
      });
    }
  }
};
