import type {
	AccessTokenCipher,
	Credentials,
	PasswordCipher,
	RefreshTokenCipher,
} from '@/auth/domain';
import { PasswordVerifierService, TokensGeneratorService } from '@/auth/domain';
import { InvalidCredentialsError } from '@/auth/domain/error';
import type { UsersRepository } from '@/users/domain';

export function Authenticathor(
	passwordCipher: PasswordCipher,
	accessTokenCipher: AccessTokenCipher,
	refreshTokenCipher: RefreshTokenCipher,
	usersRepository: UsersRepository,
) {
	return {
		exec: async (credentials: Credentials, ip: string) => {
			const userFound = await usersRepository.findByEmail(
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
				usersRepository,
				userFound,
				ip,
			);
		},
	};
}
