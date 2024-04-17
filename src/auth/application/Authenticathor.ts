import type {
	AccessPayload,
	AuthRepository,
	Credentials,
	PasswordCipher,
	RefreshPayload,
	TokenCipher,
} from '@/auth/domain';
import {
	InvalidCredentialsError,
	PasswordVerifierService,
	TokensGeneratorService,
} from '@/auth/domain';

export function Authenticathor(
	passwordCipher: PasswordCipher,
	accessTokenCipher: TokenCipher<AccessPayload>,
	refreshTokenCipher: TokenCipher<RefreshPayload>,
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
