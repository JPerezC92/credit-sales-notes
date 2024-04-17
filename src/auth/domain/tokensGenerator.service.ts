import * as crypto from 'node:crypto';

import type {
	AccessPayload,
	AuthRepository,
	RefreshPayload,
	TokenCipher,
} from '@/auth/domain';
import { AuthUser } from '@/auth/domain';

export async function TokensGeneratorService(
	accessTokenCipher: TokenCipher<AccessPayload>,
	refreshTokenCipher: TokenCipher<RefreshPayload>,
	authRepository: AuthRepository,
	user: AuthUser,
	ip: string,
) {
	const tokenId = crypto.randomUUID();
	const _user = new AuthUser(structuredClone(user));

	_user.addToken(ip, tokenId);

	const refreshToken = refreshTokenCipher.encode({
		email: user.email,
		tokenId,
	});

	await authRepository.updateUserToken(_user);

	return {
		refreshToken,
		accessToken: accessTokenCipher.encode({
			email: user.email,
			userId: user.userId,
		}),
	};
}
