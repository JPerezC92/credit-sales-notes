import { text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';

import { usersDb } from './users.db';

export const authUserDb = tableCreator('AuthUsers', {
	authUserId: text('authUserId').primaryKey().notNull().unique(),
	userId: text('userId')
		.notNull()
		.references(() => usersDb.userId),
	password: text('password', { length: 60 }).notNull(),
	token: text('token', { mode: 'json' })
		.$type<Record<string, string>>()
		.notNull()
		.default({}),
});

export type AuthUserDb = typeof authUserDb.$inferSelect;
