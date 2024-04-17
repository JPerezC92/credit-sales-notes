import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import mock from 'jest-mock-extended/lib/Mock';

import { Authenticathor } from '@/auth/application';
import type { AuthRepository } from '@/auth/domain';
import { InvalidCredentialsError } from '@/auth/domain';
import {
	AccessTokenCipher,
	BcryptPasswordCipher,
	RefreshTokenCipher,
} from '@/auth/infrastructure/services';
import {
	AuthUserMother,
	CredentialsMother,
} from '@/test/auth/infrastructure/fixtures';

const mockAuthRepository = mock<AuthRepository>();

describe('Authenticathor Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return an error if the user is not found', async () => {
		// GIVEN
		const credentials = CredentialsMother.create();

		// WHEN
		const result = await Authenticathor(
			new BcryptPasswordCipher(),
			new AccessTokenCipher(new JwtService(), new ConfigService()),
			new RefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, '');

		// THEN
		expect(result).toBeInstanceOf(InvalidCredentialsError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
	});

	it('should return an error if the password is invalid', async () => {
		// GIVEN
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const authUser = await AuthUserMother.create({
			email: credentials.email,
			password: faker.internet.password(),
		});

		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// WHEN
		const result = await Authenticathor(
			new BcryptPasswordCipher(),
			new AccessTokenCipher(new JwtService(), new ConfigService()),
			new RefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, ip);

		// THEN
		expect(result).toBeInstanceOf(InvalidCredentialsError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
	});

	it('should return an access token and a refresh token', async () => {
		// GIVEN
		const ip = faker.internet.ipv4();
		const credentials = CredentialsMother.create();
		const authUser = await AuthUserMother.create({
			email: credentials.email,
			password: credentials.password,
		});

		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);

		// WHEN
		const result = await Authenticathor(
			new BcryptPasswordCipher(),
			new AccessTokenCipher(new JwtService(), new ConfigService()),
			new RefreshTokenCipher(new JwtService(), new ConfigService()),
			mockAuthRepository,
		).exec(credentials, ip);

		// THEN
		expect(result).toEqual({
			refreshToken: expect.any(String),
			accessToken: expect.any(String),
		});
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			credentials.email,
		);
	});
});
