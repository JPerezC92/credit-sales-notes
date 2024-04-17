import { usersDb } from '@/db/schemas';
import type { TX } from '@/db/services';
import type { UsersRepository } from '@/users/domain';
import { userDbToDomain } from '@/users/infrastructure/adapters';

export function prdUserRepository(db: TX): UsersRepository {
	return {
		async save(user) {
			await db.insert(usersDb).values(user).execute();
		},

		async findByEmail(email) {
			const result = await db.query.usersDb.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (!result) return null;

			return userDbToDomain(result);
		},
	};
}
