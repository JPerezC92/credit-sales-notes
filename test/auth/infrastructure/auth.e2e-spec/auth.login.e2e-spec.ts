/**
 * E2E Tests for the AuthController's login endpoint.
 * These tests cover scenarios such as valid credentials, invalid email, invalid password,
 * and error cases when encoding access and refresh tokens.
 */

import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import type { App } from 'supertest/types';

import {
	AccessTokenCiphrationError,
	InvalidCredentialsError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import {
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
	PrdAuthRepository,
} from '@/auth/infrastructure/services';
import { credentials1 } from '@/db/seeders';
import { RepositoryError } from '@/shared/domain';
import { versioningConfig } from '@/shared/infrastructure/utils';
import { authorizationExpected } from '@/test/auth/domain';
import { badRequestErrorExpected } from '@/test/auth/infrastructure/fixtures';
import { ErrorResponseExpected } from '@/test/shared/infrastructure/fixtures';

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		app.enableVersioning(versioningConfig);

		await app.init();
	});

	it('should return accessToken and refreshToken when the credentials are valid', async () => {
		// When the credentials are valid
		const response = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send(credentials1);
		// .catch(err => console.log(err));

		// Then the response should be an Ok with the accessToken and refreshToken
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body).toEqual(authorizationExpected);
	});

	it('should return 400 Bad Request when the email is not valid', async () => {
		// When the email is not valid
		const response = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({ email: 'wrong-email', password: 111 });

		// Then the response should be a Bad Request
		expect(response.status).toBe(HttpStatus.BAD_REQUEST);
		expect(response.body).toEqual(badRequestErrorExpected);
	});

	it('should return 401 Unauthorized when the password is not valid', async () => {
		// When the password is not valid
		await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({ ...credentials1, password: 'wrong-password' })
			.expect(HttpStatus.UNAUTHORIZED)
			.then(response => {
				// Then the response should be an Unauthorized
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.UNAUTHORIZED,
						message: expect.any(String),
						error: InvalidCredentialsError.code,
					}),
				);
			});
	});

	it('should return 500 Internal Server Error when the accessTokenCipher.encode method throws an error', async () => {
		jest.spyOn(
			JwtAccessTokenCipher.prototype,
			'encode',
		).mockImplementationOnce(() => new AccessTokenCiphrationError());

		// When the accessTokenCipher.encode method throws an error
		await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send(credentials1)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.then(response => {
				// Then the response should be an Internal Server Error
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						message: expect.any(String),
						error: AccessTokenCiphrationError.code,
					}),
				);
			});
	});

	it('should return 500 Internal Server Error when the refreshTokenCipher.encode method throws an error', async () => {
		jest.spyOn(
			JwtRefreshTokenCipher.prototype,
			'encode',
		).mockImplementationOnce(() => new RefreshTokenCiphrationError());

		// When the refreshTokenCipher.encode method throws an error
		await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send(credentials1)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.then(response => {
				// Then the response should be an Internal Server Error
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						message: expect.any(String),
						error: RefreshTokenCiphrationError.code,
					}),
				);
			});
	});

	it('should return 500 Internal Server Error when an RepositoryError is thrown', async () => {
		jest.spyOn(
			PrdAuthRepository.prototype,
			'findUserByEmail',
		).mockRejectedValueOnce(new RepositoryError('Test Error'));

		// When the repository throws an error
		await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send(credentials1)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.then(response => {
				// Then the response should be an Internal Server Error
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						error: RepositoryError.code,
					}),
				);
			});
	});
});
