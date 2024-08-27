import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { userDbToActionDb } from '@/db/schemas/userAttributeToAction.db';
import { userDbToRoleDb } from '@/db/schemas/userAttributeToRole.db';
import { TableNames } from '@/db/utils/tableNames';

import { personDb, timestampDb } from './shared.db';

export const userDb = tableCreator(TableNames.User, {
	...personDb,
	...timestampDb,
	userId: text('userId').primaryKey().notNull().unique(),
	email: text('email', { length: 150 }).unique().notNull(),
	password: text('password', { length: 60 }).notNull(),
	token: text('token', { mode: 'json' })
		.$type<Record<string, string>>()
		.notNull()
		.default({}),
});

export type UsersDb = typeof userDb.$inferSelect;

export const usersRelations = relations(userDb, ({ one, many }) => ({
	userToRole: many(userDbToRoleDb),
	userToAction: many(userDbToActionDb),
}));
