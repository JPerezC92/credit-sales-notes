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
	RefreshTokenCipher,
} from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import {
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { UserMother } from '@/db/mothers';
import { authorizationExpected } from '@/test/auth/domain/authorization.expected';
import type { UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';

const mockUsersRepository = mock<UsersRepository>();
const mockAccessTokenCipher = mock<AccessTokenCipher>();
const mockRefreshTokenCipher = mock<RefreshTokenCipher>();

describe('SessionRevalidator Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should return a valid token and update the user', async () => {
		// Given a user with a token and a refresh token
		const user = await UserMother.create();
		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the session is revalidated
		const result = await SessionRevalidator(
			mockUsersRepository,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
		).exec(user.email, faker.internet.ipv4());

		// Then the session is revalidated and the user is updated
		expect(result).toEqual<Authorization>(authorizationExpected);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			user.email,
		);
		expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
	});

	it('should return an error if the user is not found', async () => {
		// Given a user that does not exist
		const user = await UserMother.create();

		const ip = faker.internet.ipv4();
		mockUsersRepository.findByEmail.mockResolvedValueOnce(null);

		// When the session is revalidated
		const error = await SessionRevalidator(
			mockUsersRepository,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
		).exec(user.email, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(UserNotFoundError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			user.email,
		);
		expect(mockUsersRepository.update).not.toHaveBeenCalled();
	});

	it('should return an error if the access token cipher fails', async () => {
		// Given a user with a token and a refresh token
		const user = await UserMother.create();
		mockAccessTokenCipher.encode.mockReturnValueOnce(
			new AccessTokenCiphrationError(),
		);
		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the session is revalidated
		const error = await SessionRevalidator(
			mockUsersRepository,
			mockAccessTokenCipher,
			mockRefreshTokenCipher,
		).exec(user.email, faker.internet.ipv4());

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(AccessTokenCiphrationError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			user.email,
		);
		expect(mockUsersRepository.update).not.toHaveBeenCalled();
		expect(mockRefreshTokenCipher.encode).toHaveBeenCalled();
	});

	it('should return an error if the refresh token cipher fails', async () => {
		// Given a user with a token and a refresh token
		const user = await UserMother.create();

		mockRefreshTokenCipher.encode.mockReturnValueOnce(
			new RefreshTokenCiphrationError(),
		);
		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the session is revalidated
		const error = await SessionRevalidator(
			mockUsersRepository,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			mockRefreshTokenCipher,
		).exec(user.email, faker.internet.ipv4());

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(RefreshTokenCiphrationError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			user.email,
		);
		expect(mockUsersRepository.update).not.toHaveBeenCalled();
		expect(mockRefreshTokenCipher.encode).toHaveBeenCalledTimes(1);
		expect(mockAccessTokenCipher.encode).not.toHaveBeenCalled();
	});
});
