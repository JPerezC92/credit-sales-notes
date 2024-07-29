import type {
	AccessTokenCipher,
	AuthRepository,
	Credentials,
	PasswordCipher,
	RefreshTokenCipher,
} from '@/auth/domain';
import { PasswordVerifierService, TokensGeneratorService } from '@/auth/domain';
import { InvalidCredentialsError } from '@/auth/domain/error';

export function Authenticathor(
	passwordCipher: PasswordCipher,
	accessTokenCipher: AccessTokenCipher,
	refreshTokenCipher: RefreshTokenCipher,
	authRepository: AuthRepository,
) {
	return {
		exec: async (credentials: Credentials, ip: string) => {
			const userFound = await authRepository.findUserByEmail(
				credentials.email,
			);

			if (!userFound) {
				return new InvalidCredentialsError();
			}

			const isAuthenticated = await PasswordVerifierService(
				credentials,
				userFound,
				passwordCipher,
			);

			if (!isAuthenticated) {
				return new InvalidCredentialsError();
			}

			return await TokensGeneratorService(
				accessTokenCipher,
				refreshTokenCipher,
				authRepository,
				userFound,
				ip,
			);
		},
	};
}
