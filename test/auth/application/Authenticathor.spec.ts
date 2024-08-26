/**
 * Unit tests for the Authenticator Use Case
 */
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

import { Authenticathor } from '@/auth/application';
import type {
	AccessTokenCipher,
	PasswordCipher,
	RefreshTokenCipher,
} from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	InvalidCredentialsError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import {
	BcryptPasswordCipher,
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { CredentialsMother, UserMother } from '@/db/mothers';
import type { UsersRepository } from '@/users/domain';

const mockUsersRepository = mock<UsersRepository>();

describe('Authenticathor Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should return an access token and a refresh token', async () => {
		// Given the user is found and the password is correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const user = await UserMother.create({
			email: credentials.email,
			password: credentials.password,
		});

		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the user tries to authenticate
		const result = await Authenticathor(
			new BcryptPasswordCipher(),
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockUsersRepository,
		).exec(credentials, ip);

		// Then an access token and a refresh token are returned
		expect(result).toEqual({
			refreshToken: expect.objectContaining({
				value: expect.any(String),
			}),
			accessToken: expect.objectContaining({
				value: expect.any(String),
				type: 'Bearer',
			}),
		});
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
	});

	it('should return an error if the user is not found', async () => {
		// Given the user is not found and the password is correct
		mockUsersRepository.findByEmail.mockResolvedValueOnce(null);
		const mockPasswordCipher = mock<PasswordCipher>();
		mockPasswordCipher.compare.mockResolvedValueOnce(true);

		const credentials = CredentialsMother.create();
		const ip = faker.internet.ipv4();

		// When the user tries to authenticate
		const error = await Authenticathor(
			mockPasswordCipher,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockUsersRepository,
		).exec(credentials, ip);

		// Then an error is returned and the password is not compared
		expect(error).toBeInstanceOf(InvalidCredentialsError);
		expect(mockPasswordCipher.compare).not.toHaveBeenCalled();
	});

	it('should return an error if the password is invalid', async () => {
		// Given the user is found and the password is not correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const user = await UserMother.create({
			email: credentials.email,
			password: faker.internet.password(),
		});

		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the user tries to authenticate
		const error = await Authenticathor(
			new BcryptPasswordCipher(),
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockUsersRepository,
		).exec(credentials, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(InvalidCredentialsError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
		expect(mockUsersRepository.update).not.toHaveBeenCalled();
	});

	it('should return an error if the access token cipher fails', async () => {
		// Given the user is found and the password is correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const user = await UserMother.create({
			email: credentials.email,
			password: credentials.password,
		});
		const mockAccessTokenCipher = mock<AccessTokenCipher>();
		mockAccessTokenCipher.encode.mockReturnValue(
			new AccessTokenCiphrationError(),
		);

		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the user tries to authenticate
		const error = await Authenticathor(
			new BcryptPasswordCipher(),
			mockAccessTokenCipher,
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockUsersRepository,
		).exec(credentials, ip);

		// Then an error is returned
		expect(error).toBeInstanceOf(AccessTokenCiphrationError);
	});

	it('should return an error if the refresh token cipher fails', async () => {
		// Given the user is found and the password is correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const user = await UserMother.create({
			email: credentials.email,
			password: credentials.password,
		});
		const mockRefreshTokenCipher = mock<RefreshTokenCipher>();
		mockRefreshTokenCipher.encode.mockReturnValue(
			new RefreshTokenCiphrationError(),
		);

		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the user tries to authenticate
		const error = await Authenticathor(
			new BcryptPasswordCipher(),
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			mockRefreshTokenCipher,
			mockUsersRepository,
		).exec(credentials, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(RefreshTokenCiphrationError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
		expect(mockUsersRepository.update).not.toHaveBeenCalled();
	});
});
