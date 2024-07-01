import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { authUserDb } from '@/db/schemas/authUser.db';

import { personDb, timestampDb } from './shared.db';

export const usersDb = tableCreator('Users', {
	...personDb,
	...timestampDb,
	userId: text('userId').primaryKey().notNull().unique(),
	email: text('email', { length: 150 }).unique().notNull(),
});

export type UsersDb = typeof usersDb.$inferSelect;

export const usersRelations = relations(usersDb, ({ one }) => ({
	authUser: one(authUserDb, {
		fields: [usersDb.userId],
		references: [authUserDb.userId],
	}),
}));
