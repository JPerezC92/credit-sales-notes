import { relations } from 'drizzle-orm';
import { primaryKey, text } from 'drizzle-orm/sqlite-core';

import { tableCreator } from '@/db/connection';
import { actionDb } from '@/db/schemas/permission.db';
import { userDb } from '@/db/schemas/users.db';
import { TableNames } from '@/db/utils/tableNames';

export const userDbToActionDb = tableCreator(
	TableNames.UserAttributeToAction,
	{
		actionId: text('actionId')
			.notNull()
			.references(() => actionDb.actionId),
		userId: text('userId')
			.notNull()
			.references(() => userDb.userId),
	},
	t => ({
		pk: primaryKey({ columns: [t.userId, t.actionId] }),
	}),
);

export const roleDbToPermissionDbRelations = relations(
	userDbToActionDb,
	({ one }) => ({
		actionDb: one(actionDb, {
			fields: [userDbToActionDb.actionId],
			references: [actionDb.actionId],
		}),
		userDb: one(userDb, {
			fields: [userDbToActionDb.userId],
			references: [userDb.userId],
		}),
	}),
);
