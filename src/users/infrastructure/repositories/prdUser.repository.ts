import { eq } from 'drizzle-orm';

import { userDomainToDbAdapter } from '@/auth/infrastructure/adapters';
import * as dbSchemas from '@/db/schemas';
import { TX } from '@/db/services';
import type { User, UsersRepository } from '@/users/domain';
import { userDbToDomain } from '@/users/infrastructure/adapters';

export class PrdUserRepository implements UsersRepository {
	constructor(private readonly db: TX) {}

	async save(user: User) {
		await this.db
			.insert(dbSchemas.userDb)
			.values(userDomainToDbAdapter(user))
			.execute();
	}

	async findByEmail(email: User['email']) {
		const result = await this.db.query.userDb.findFirst({
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
	}

	async update(user: User) {
		await this.db
			.update(dbSchemas.userDb)
			.set({
				...user,
				token: Object.fromEntries(user.token),
			})
			.where(eq(dbSchemas.userDb.userId, user.userId))
			.execute();
	}
}
