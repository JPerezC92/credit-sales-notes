import type { AuthRepository, AuthUser } from '@/auth/domain';
import { AuthUserNotFoundError } from '@/auth/domain/error';

export function SessionCloser(authRepository: AuthRepository) {
	return {
		exec: async (authUser: AuthUser, ip: string) => {
			const _authUser = await authRepository.findUserByEmail(
				authUser.email,
			);

			if (!_authUser) {
				return new AuthUserNotFoundError();
			}

			const updatedAuthUser = _authUser.removeToken(ip);

			await authRepository.updateAuthUser(updatedAuthUser);
		},
	};
}
