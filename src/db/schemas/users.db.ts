import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { TableNames } from '@/db/utils/tableNames';

import { authUserDb } from './authUser.db';
import { personDb, timestampDb } from './shared.db';
import { userDbToActionDb } from './userAttributeToAction.db';
import { userDbToRoleDb } from './userAttributeToRole.db';

export const userDb = tableCreator(TableNames.User, {
	...personDb,
	...timestampDb,
	userId: text('userId').primaryKey().notNull().unique(),
	email: text('email', { length: 150 }).unique().notNull(),
});

export type UsersDb = typeof userDb.$inferSelect;

export const usersRelations = relations(userDb, ({ one, many }) => ({
	authUser: one(authUserDb, {
		fields: [userDb.userId],
		references: [authUserDb.userId],
	}),
	userToRole: many(userDbToRoleDb),
	userToAction: many(userDbToActionDb),
}));
