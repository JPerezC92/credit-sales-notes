import * as crypto from 'node:crypto';

import type { AccessTokenCipher, RefreshTokenCipher } from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import { BearerToken, TypelessToken } from '@/auth/domain/token.model';
import type { UsersRepository } from '@/users/domain';
import { User } from '@/users/domain';

import { Authorization } from './authorization';

export async function TokensGeneratorService(
	accessTokenCipher: AccessTokenCipher,
	refreshTokenCipher: RefreshTokenCipher,
	usersRepository: UsersRepository,
	user: User,
	ip: string,
) {
	const tokenId = crypto.randomUUID();
	const _authUser = new User(structuredClone(user)).addToken(ip, tokenId);

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

	await usersRepository.update(_authUser);

	return new Authorization({
		refreshToken: new TypelessToken(refreshToken),
		accessToken: new BearerToken(accessToken),
	});
}
