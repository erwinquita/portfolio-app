import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  emailVerified: text('email_verified'),
  image: text('image'),
  updatedAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').unique().notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// THIS IS THE MISSING TABLE
export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});


export const categories = sqliteTable('categories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at')
});

export const portfolios = sqliteTable('portfolios', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  projectUrl: text('project_url'),
  tags: text('tags'), // JSON string of tags array
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at')
});

