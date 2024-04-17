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
	AuthRepository,
	PasswordCipher,
	RefreshTokenCipher,
} from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	InvalidCredentialsError,
	RefreshTokenCiphrationError,
} from '@/auth/domain';
import {
	BcryptPasswordCipher,
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
} from '@/auth/infrastructure/services';
import {
	AuthUserMother,
	CredentialsMother,
} from '@/test/auth/infrastructure/mothers';

const mockAuthRepository = mock<AuthRepository>();

describe('Authenticathor Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should return an access token and a refresh token', async () => {
		// Given the user is found and the password is correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const authUser = await AuthUserMother.create({
			email: credentials.email,
			password: credentials.password,
		});

		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the user tries to authenticate
		const result = await Authenticathor(
			new BcryptPasswordCipher(),
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, ip);

		// Then an access token and a refresh token are returned
		expect(result).toEqual({
			refreshToken: expect.any(String),
			accessToken: expect.any(String),
		});
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
	});

	it('should return an error if the user is not found', async () => {
		// Given the user is not found and the password is correct
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(null);
		const mockPasswordCipher = mock<PasswordCipher>();
		mockPasswordCipher.compare.mockResolvedValueOnce(true);

		const credentials = CredentialsMother.create();
		const ip = faker.internet.ipv4();

		// When the user tries to authenticate
		const error = await Authenticathor(
			mockPasswordCipher,
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, ip);

		// Then an error is returned and the password is not compared
		expect(error).toBeInstanceOf(InvalidCredentialsError);
		expect(mockPasswordCipher.compare).not.toHaveBeenCalled();
	});

	it('should return an error if the password is invalid', async () => {
		// Given the user is found and the password is not correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const authUser = await AuthUserMother.create({
			email: credentials.email,
			password: faker.internet.password(),
		});

		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the user tries to authenticate
		const error = await Authenticathor(
			new BcryptPasswordCipher(),
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(InvalidCredentialsError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
		expect(mockAuthRepository.updateAuthUser).not.toHaveBeenCalled();
	});

	it('should return an error if the access token cipher fails', async () => {
		// Given the user is found and the password is correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const authUser = await AuthUserMother.create({
			email: credentials.email,
			password: credentials.password,
		});
		const mockAccessTokenCipher = mock<AccessTokenCipher>();
		mockAccessTokenCipher.encode.mockReturnValue(
			new AccessTokenCiphrationError(),
		);

		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the user tries to authenticate
		const error = await Authenticathor(
			new BcryptPasswordCipher(),
			mockAccessTokenCipher,
			new JwtRefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, ip);

		// Then an error is returned
		expect(error).toBeInstanceOf(AccessTokenCiphrationError);
	});

	it('should return an error if the refresh token cipher fails', async () => {
		// Given the user is found and the password is correct
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const authUser = await AuthUserMother.create({
			email: credentials.email,
			password: credentials.password,
		});
		const mockRefreshTokenCipher = mock<RefreshTokenCipher>();
		mockRefreshTokenCipher.encode.mockReturnValue(
			new RefreshTokenCiphrationError(),
		);

		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// When the user tries to authenticate
		const error = await Authenticathor(
			new BcryptPasswordCipher(),
			new JwtAccessTokenCipher(new JwtService(), new ConfigService()),
			mockRefreshTokenCipher,
			mockAuthRepository,
		).exec(credentials, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(RefreshTokenCiphrationError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
		expect(mockAuthRepository.updateAuthUser).not.toHaveBeenCalled();
	});
});
