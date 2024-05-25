import type { AuthUser } from '@/auth/domain';
import { authUserDbToDomainAdapter } from '@/auth/infrastructure/adapters';
import { TX } from '@/db/services';

export class AuthUtilsRepository {
	constructor(private readonly tx: TX) {}

	async findUserByEmail(email: string): Promise<AuthUser | null> {
		const result = await this.tx.query.usersDb.findFirst({
			where: (users, { eq }) => eq(users.email, email),
			with: { authUser: true },
		});

		if (!result) return null;

		return authUserDbToDomainAdapter(result.authUser, result.email);
	}
}
