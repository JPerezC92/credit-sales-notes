import { relations } from 'drizzle-orm';
import { primaryKey, text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { userDb } from '@/db/schemas/users.db';
import { TableNames } from '@/db/utils/tableNames';

import { roleDb } from './role.db';

export const userDbToRoleDb = tableCreator(
	TableNames.UserAttributeToRole,
	{
		roleId: text('roleId')
			.notNull()
			.references(() => roleDb.roleId),
		userId: text('userId')
			.notNull()
			.references(() => userDb.userId),
	},
	t => ({
		pk: primaryKey({ columns: [t.userId, t.roleId] }),
	}),
);

export const roleDbToActionDbRelations = relations(
	userDbToRoleDb,
	({ one }) => ({
		roleDb: one(roleDb, {
			fields: [userDbToRoleDb.roleId],
			references: [roleDb.roleId],
		}),
		userDb: one(userDb, {
			fields: [userDbToRoleDb.userId],
			references: [userDb.userId],
		}),
	}),
);
