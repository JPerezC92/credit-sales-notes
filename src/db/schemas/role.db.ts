import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

import type { RoleType } from '@/auth/domain';
import { tableCreator } from '@/db/connection';
import { TableNames } from '@/db/utils/tableNames';

import { userDbToRoleDb } from './userAttributeToRole.db';

export const roleDb = tableCreator(TableNames.Role, {
	roleId: text('roleId').primaryKey().notNull().unique(),
	name: text('name').$type<RoleType>().notNull().unique(),
});

export type RoleDb = typeof roleDb.$inferSelect;

export const roleDbRelations = relations(roleDb, ({ many }) => ({
	roleDbToPermissionDb: many(userDbToRoleDb),
}));
