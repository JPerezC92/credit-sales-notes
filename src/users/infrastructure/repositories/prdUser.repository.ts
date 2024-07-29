import * as dbSchemas from '@/db/schemas';
import type { TX } from '@/db/services';
import type { UsersRepository } from '@/users/domain';
import { userDbToDomain } from '@/users/infrastructure/adapters';

export function prdUserRepository(db: TX): UsersRepository {
	return {
		async save(user) {
			await db.insert(dbSchemas.userDb).values(user).execute();
		},

		async findByEmail(email) {
			const result = await db.query.userDb.findFirst({
				where: (users, { eq }) => eq(users.email, email),
				with: {
					userToRole: {
						columns: { roleId: true },
					},
					userToAction: {
						columns: { actionId: true },
					},
				},
			});

			if (!result) return null;

			return userDbToDomain(
				result,
				result.userToRole.map(({ roleId }) => roleId),
				result.userToAction.map(({ actionId }) => actionId),
			);
		},
	};
}
