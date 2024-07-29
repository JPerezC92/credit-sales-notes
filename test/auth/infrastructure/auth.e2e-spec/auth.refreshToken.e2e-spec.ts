/**
 * End-to-end tests for the refresh-token endpoint.
 * This file contains tests for the AuthController's refresh-token functionality.
 * It tests the generation of new access and refresh tokens, as well as the invalidation of previous refresh tokens.
 */

import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import type { App } from 'supertest/types';

import { AuthModule } from '@/auth/infrastructure/auth.module';
import { PrdAuthRepository } from '@/auth/infrastructure/services';
import { credentials1 } from '@/db/seeders';
import { RepositoryError } from '@/shared/domain';
import { versioningConfig } from '@/shared/infrastructure/utils';
import { authorizationExpected } from '@/test/auth/domain';
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

	it('should return accessToken and refreshToken and invalidate the previous refreshToken when the refreshToken is valid', async () => {
		// Given a valid refreshToken
		const {
			body: { refreshToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send(credentials1)
			.expect(HttpStatus.OK);

		// When the refreshToken is valid
		const response = await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/refresh-token')
			.set('x-refresh-token', `${refreshToken.value}`)
			.expect(HttpStatus.OK);

		// Then the response should be an Ok with a new accessToken and refreshToken
		expect(response.body).toEqual(authorizationExpected);

		// When the refreshToken is used again
		const secondResponse = await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/refresh-token')
			.set('x-refresh-token', `${refreshToken.value}`)
			.expect(HttpStatus.UNAUTHORIZED);

		// Then the response should be an Unauthorized
		expect(secondResponse.body).toEqual({
			statusCode: HttpStatus.UNAUTHORIZED,
			message: expect.any(String),
		});
	});

	it('should return an Internal Server Error if a RepositoryError occurs', async () => {
		// Given a valid refreshToken
		const {
			body: { refreshToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send(credentials1)
			.expect(HttpStatus.OK);

		// Mock the AuthRepository's findUserByEmail method to throw an error
		jest.spyOn(
			PrdAuthRepository.prototype,
			'findUserByEmail',
		).mockRejectedValue(new RepositoryError('Test Error'));

		// When the refreshToken is used
		const response = await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/refresh-token')
			.set('x-refresh-token', `${refreshToken.value}`)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR);

		// Then the response should be an Internal Server Error
		expect(response.body).toEqual(
			ErrorResponseExpected.create({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				error: RepositoryError.code,
			}),
		);
	});
});
