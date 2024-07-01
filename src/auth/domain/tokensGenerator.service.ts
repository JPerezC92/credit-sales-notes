import * as crypto from 'node:crypto';

import type {
	AccessTokenCipher,
	AuthRepository,
	RefreshTokenCipher,
} from '@/auth/domain';
import { AuthUser } from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import { BearerToken, TypelessToken } from '@/auth/domain/token.model';

import { Authorization } from './authorization';

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

	return new Authorization({
		refreshToken: new TypelessToken(refreshToken),
		accessToken: new BearerToken(accessToken),
	});
}
