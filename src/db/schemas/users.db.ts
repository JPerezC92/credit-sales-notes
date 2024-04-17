import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { authUserDb } from '@/db/schemas/authUser.db';

export const usersDb = tableCreator('Users', {
	userId: text('userId').primaryKey().notNull().unique(),
	firstNameOne: text('firstNameOne', { length: 50 }).notNull(),
	firstNameTwo: text('firstNameTwo', { length: 50 }),
	lastNameOne: text('lastNameOne', { length: 50 }).notNull(),
	lastNameTwo: text('lastNameTwo', { length: 50 }),
	email: text('email', { length: 150 }).unique().notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	modifiedAt: integer('modifiedAt', { mode: 'timestamp' }).notNull(),
});

export type UsersDb = typeof usersDb.$inferSelect;

export const usersRelations = relations(usersDb, ({ one }) => ({
	authUser: one(authUserDb, {
		fields: [usersDb.userId],
		references: [authUserDb.userId],
	}),
}));
