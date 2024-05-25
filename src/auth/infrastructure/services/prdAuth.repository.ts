import { eq } from 'drizzle-orm';

import { type AuthRepository, type AuthUser } from '@/auth/domain';
import {
	authUserDbToDomainAdapter,
	authUserDomainToDbAdapter,
} from '@/auth/infrastructure/adapters';
import { authUserDb } from '@/db/schemas';
import { TX } from '@/db/services';
import { RepositoryError } from '@/shared/domain';

export class PrdAuthRepository implements AuthRepository {
	constructor(private readonly tx: TX) {}

	async findUserByEmail(email: string): Promise<AuthUser | null> {
		try {
			const result = await this.tx.query.usersDb.findFirst({
				where: (users, { eq }) => eq(users.email, email),
				with: { authUser: true },
			});

			if (!result) return null;

			return authUserDbToDomainAdapter(result.authUser, result.email);
		} catch (error) {
			throw new RepositoryError(error);
		}
	}

	async saveAuthUser(user: AuthUser): Promise<void> {
		try {
			await this.tx
				.insert(authUserDb)
				.values(authUserDomainToDbAdapter(user));
		} catch (error) {
			throw new RepositoryError(error);
		}
	}

	async updateAuthUser(user: AuthUser): Promise<void> {
		try {
			await this.tx
				.update(authUserDb)
				.set({
					...user,
					token: Object.fromEntries(user.token),
				})
				.where(eq(authUserDb.userId, user.userId));
		} catch (error) {
			throw new RepositoryError(error);
		}
	}
}
