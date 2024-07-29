import type {
	AccessTokenCipher,
	AuthRepository,
	AuthUser,
	RefreshTokenCipher,
} from '@/auth/domain';
import { TokensGeneratorService } from '@/auth/domain';
import { AuthUserNotFoundError } from '@/auth/domain/error';

export function SessionRevalidator(
	authRepository: AuthRepository,
	accesTokenCipher: AccessTokenCipher,
	refreshTokenCipher: RefreshTokenCipher,
) {
	return {
		exec: async (email: AuthUser['email'], ip: string) => {
			const _authUser = await authRepository.findUserByEmail(email);

			if (!_authUser) {
				return new AuthUserNotFoundError();
			}

			return await TokensGeneratorService(
				accesTokenCipher,
				refreshTokenCipher,
				authRepository,
				_authUser,
				ip,
			);
		},
	};
}
