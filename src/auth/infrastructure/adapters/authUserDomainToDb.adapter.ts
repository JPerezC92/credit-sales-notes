import type { AuthUser } from '@/auth/domain/authUser.model';
import type { AuthUserDb } from '@/db/schemas';

export function authUserDomainToDbAdapter(user: AuthUser): AuthUserDb {
	return {
		authUserId: user.authUserId,
		password: user.password,
		userId: user.userId,
		token: Object.fromEntries(user.token),
	};
}
