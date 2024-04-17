import { eq } from 'drizzle-orm';

import type { AuthRepository } from '@/auth/domain/auth.repository';
import { authUserDbToDomainAdapter } from '@/auth/infrastructure/adapters';
import { authUserDb } from '@/db/schemas';
import type { TX } from '@/db/services';

export function prdAuthRepository(tx: TX): AuthRepository {
	return {
		async saveUser(user) {
			await tx.insert(authUserDb).values({
				authUserId: user.authUserId,
				userId: user.userId,
				password: user.password,
				token: Object.fromEntries(user.token),
			});
		},
		async findUserByEmail(email) {
			const result = await tx.query.usersDb.findFirst({
				where: (users, { eq }) => eq(users.email, email),
				with: { authUser: true },
			});

			if (!result) return null;

			return authUserDbToDomainAdapter(result.authUser, result.email);
		},

		async updateUserToken(user) {
			await tx
				.update(authUserDb)
				.set({
					token: Object.fromEntries(user.token),
				})
				.where(eq(authUserDb.userId, user.userId));
		},
	};
}
