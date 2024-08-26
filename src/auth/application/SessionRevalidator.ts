import type { AccessTokenCipher, RefreshTokenCipher } from '@/auth/domain';
import { TokensGeneratorService } from '@/auth/domain';
import type { User, UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';

export function SessionRevalidator(
	usersRepository: UsersRepository,
	accesTokenCipher: AccessTokenCipher,
	refreshTokenCipher: RefreshTokenCipher,
) {
	return {
		exec: async (email: User['email'], ip: string) => {
			const user = await usersRepository.findByEmail(email);

			if (!user) {
				return new UserNotFoundError();
			}

			return await TokensGeneratorService(
				accesTokenCipher,
				refreshTokenCipher,
				usersRepository,
				user,
				ip,
			);
		},
	};
}
