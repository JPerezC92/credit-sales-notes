import { AuthUser } from '@/auth/domain/authUser.model';
import type { AuthUserDb } from '@/db/schemas';

export function authUserDbToDomainAdapter(
	userDb: AuthUserDb,
	email: string,
): AuthUser {
	return new AuthUser({
		authUserId: userDb.authUserId,
		password: userDb.password,
		userId: userDb.userId,
		email,
		token: new Map(Object.entries(userDb.token)),
	});
}
