import { text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { TableNames } from '@/db/utils/tableNames';

import { userDb } from './users.db';

export const authUserDb = tableCreator(TableNames.AuthUser, {
	authUserId: text('authUserId').primaryKey().notNull().unique(),
	userId: text('userId')
		.notNull()
		.unique()
		.references(() => userDb.userId),
	password: text('password', { length: 60 }).notNull(),
	token: text('token', { mode: 'json' })
		.$type<Record<string, string>>()
		.notNull()
		.default({}),
});

export type AuthUserDb = typeof authUserDb.$inferSelect;
