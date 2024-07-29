/**
 * Unit tests for the SessionRevalidator Use Case
 */
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

import { SessionRevalidator } from '@/auth/application';
import type {
	AccessTokenCipher,
	Authorization,
	AuthRepository,
	RefreshTokenCipher,
} from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	AuthUserNotFoundError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import {
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { AuthUserMother } from '@/db/mothers';
import { authorizationExpected } from '@/test/auth/domain/authorization.expected';

const mockAuthRepository = mock<AuthRepository>();
const mockAccessTokenCipher = mock<AccessTokenCipher>();
const mockRefreshTokenCipher = mock<RefreshTokenCipher>();

describe('SessionRevalidator Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should return a valid token and update the user', async () => {
		// Given a user with a token and a refresh token
		const authUser = await AuthUserMother.create();
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the session is revalidated
		const result = await SessionRevalidator(
			mockAuthRepository,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
		).exec(authUser.email, faker.internet.ipv4());

		// Then the session is revalidated and the user is updated
		expect(result).toEqual<Authorization>(authorizationExpected);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
		expect(mockAuthRepository.updateAuthUser).toHaveBeenCalledTimes(1);
	});

	it('should return an error if the user is not found', async () => {
		// Given a user that does not exist
		const email = (await AuthUserMother.create()).email;
		const ip = faker.internet.ipv4();
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(null);

		// When the session is revalidated
		const error = await SessionRevalidator(
			mockAuthRepository,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
		).exec(email, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(AuthUserNotFoundError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(email);
		expect(mockAuthRepository.updateAuthUser).not.toHaveBeenCalled();
	});

	it('should return an error if the access token cipher fails', async () => {
		// Given a user with a token and a refresh token
		const authUser = await AuthUserMother.create();
		mockAccessTokenCipher.encode.mockReturnValueOnce(
			new AccessTokenCiphrationError(),
		);
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the session is revalidated
		const error = await SessionRevalidator(
			mockAuthRepository,
			mockAccessTokenCipher,
			mockRefreshTokenCipher,
		).exec(authUser.email, faker.internet.ipv4());

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(AccessTokenCiphrationError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
		expect(mockAuthRepository.updateAuthUser).not.toHaveBeenCalled();
		expect(mockRefreshTokenCipher.encode).toHaveBeenCalled();
	});

	it('should return an error if the refresh token cipher fails', async () => {
		// Given a user with a token and a refresh token
		const authUser = await AuthUserMother.create();

		mockRefreshTokenCipher.encode.mockReturnValueOnce(
			new RefreshTokenCiphrationError(),
		);
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the session is revalidated
		const error = await SessionRevalidator(
			mockAuthRepository,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			mockRefreshTokenCipher,
		).exec(authUser.email, faker.internet.ipv4());

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(RefreshTokenCiphrationError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
		expect(mockAuthRepository.updateAuthUser).not.toHaveBeenCalled();
		expect(mockRefreshTokenCipher.encode).toHaveBeenCalledTimes(1);
		expect(mockAccessTokenCipher.encode).not.toHaveBeenCalled();
	});
});
