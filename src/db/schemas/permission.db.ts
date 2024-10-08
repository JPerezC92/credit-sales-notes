import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { TableNames } from '@/db/utils/tableNames';
import type { ActionType } from '@/src/actions/domain';

import { userDbToRoleDb } from './userAttributeToRole.db';

export const actionDb = tableCreator(TableNames.Action, {
	actionId: text('actionId').primaryKey().notNull().unique(),
	name: text('name').$type<ActionType>().notNull().unique(),
});

export type ActionDb = typeof actionDb.$inferSelect;

export const permissionRelations = relations(actionDb, ({ many }) => ({
	roleDbToPermissionDb: many(userDbToRoleDb),
}));
