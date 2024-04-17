import * as crypto from 'node:crypto';

import type {
	AccessTokenCipher,
	AuthRepository,
	RefreshTokenCipher,
} from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	AuthUser,
	RefreshTokenCiphrationError,
} from '@/auth/domain';

import { AuthToken } from './authToken';

export async function TokensGeneratorService(
	accessTokenCipher: AccessTokenCipher,
	refreshTokenCipher: RefreshTokenCipher,
	authRepository: AuthRepository,
	user: AuthUser,
	ip: string,
) {
	const tokenId = crypto.randomUUID();
	const _authUser = new AuthUser(structuredClone(user)).addToken(ip, tokenId);

	const refreshToken = refreshTokenCipher.encode({
		email: _authUser.email,
		tokenId,
	});

	if (RefreshTokenCiphrationError.isInstance(refreshToken)) {
		return refreshToken;
	}

	const accessToken = accessTokenCipher.encode({
		email: _authUser.email,
		userId: _authUser.userId,
	});

	if (AccessTokenCiphrationError.isInstance(accessToken)) {
		return accessToken;
	}

	await authRepository.updateAuthUser(_authUser);

	return new AuthToken({
		refreshToken,
		accessToken,
	});
}
