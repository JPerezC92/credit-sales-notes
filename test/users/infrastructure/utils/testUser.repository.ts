import { and, eq, ne, sql } from 'drizzle-orm';

import { userDomainToDbAdapter } from '@/auth/infrastructure/adapters';
import { UserMother } from '@/db/mothers';
import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';
import type { ActionType } from '@/src/actions/domain';
import { type RoleType } from '@/src/roles/domain';
import type { User } from '@/users/domain';
import { userDbToDomain } from '@/users/infrastructure/adapters';

export class TestUserRepository {
	async findOrCreateUserWithRoleAndAction(
		roleName: RoleType,
		actionName: ActionType,
	): Promise<User> {
		const result = await db
			.select({ user: dbSchemas.userDb })
			.from(dbSchemas.userDb)
			.innerJoin(
				dbSchemas.userDbToRoleDb,
				and(
					eq(
						dbSchemas.userDbToRoleDb.userId,
						dbSchemas.userDb.userId,
					),
				),
			)
			.innerJoin(
				dbSchemas.roleDb,
				and(
					eq(
						dbSchemas.roleDb.roleId,
						dbSchemas.userDbToRoleDb.roleId,
					),
					eq(dbSchemas.roleDb.name, roleName),
				),
			)
			.innerJoin(
				dbSchemas.userDbToActionDb,
				eq(dbSchemas.userDbToActionDb.userId, dbSchemas.userDb.userId),
			)
			.innerJoin(
				dbSchemas.actionDb,
				and(
					eq(
						dbSchemas.actionDb.actionId,
						dbSchemas.userDbToActionDb.actionId,
					),
					eq(dbSchemas.actionDb.name, actionName),
					ne(dbSchemas.actionDb.name, actionName),
				),
			)
			.limit(1)
			.execute();

		const user = result?.[0]?.user;

		if (user) {
			const roles = (
				await db
					.select()
					.from(dbSchemas.userDbToRoleDb)
					.where(eq(dbSchemas.userDbToRoleDb.userId, user.userId))
					.execute()
			).map(role => role.roleId);

			const actions = (
				await db
					.select()
					.from(dbSchemas.userDbToActionDb)
					.where(eq(dbSchemas.userDbToActionDb.userId, user.userId))
					.execute()
			).map(action => action.actionId);

			return userDbToDomain(user, roles, actions);
		}

		const newUser = await UserMother.create();

		await db
			.insert(dbSchemas.userDb)
			.values(userDomainToDbAdapter(newUser));

		const roles = await db
			.select({
				roleId: dbSchemas.roleDb.roleId,
				userId: sql<string>`${newUser.userId}`,
			})
			.from(dbSchemas.roleDb)
			.where(eq(dbSchemas.roleDb.name, roleName))
			.execute();
		await db.insert(dbSchemas.userDbToRoleDb).values(roles).execute();

		const actions = await db
			.select({
				actionId: dbSchemas.actionDb.actionId,
				userId: sql<string>`${newUser.userId}`,
			})
			.from(dbSchemas.actionDb)
			.where(eq(dbSchemas.actionDb.name, actionName))
			.execute();
		await db.insert(dbSchemas.userDbToActionDb).values(actions).execute();

		return newUser;
	}

	async findActionByUserId(userId: string) {
		return await db
			.select()
			.from(dbSchemas.userDbToActionDb)
			// .innerJoin(
			// 	dbSchemas.userDbToActionDb,
			// 	eq(dbSchemas.userDbToActionDb.userId, dbSchemas.userDb.userId),
			// )
			.innerJoin(
				dbSchemas.actionDb,
				and(
					eq(
						dbSchemas.actionDb.actionId,
						dbSchemas.userDbToActionDb.actionId,
					),
				),
			)
			.where(eq(dbSchemas.userDbToActionDb.userId, userId));
	}
}
