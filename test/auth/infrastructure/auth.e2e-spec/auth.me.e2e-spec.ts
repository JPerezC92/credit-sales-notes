/**
 * End-to-end tests for the AuthController's me endpoint.
 * Tests the authentication and authorization functionality.
 */

import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import type { App } from 'supertest/types';

import { AuthModule } from '@/auth/infrastructure/auth.module';
import { userTest1 } from '@/db/seeders';
import { RepositoryError } from '@/shared/domain';
import { versioningConfig } from '@/shared/infrastructure/utils';
import { ActionType } from '@/src/actions/domain';
import { RoleType } from '@/src/roles/domain';
import { ErrorResponseExpected } from '@/test/shared/infrastructure/fixtures';
import { config, TestUserRepository } from '@/test/users/infrastructure/utils';
import type { User } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';
import { PrdUserRepository } from '@/users/infrastructure/repositories';
import type { UserEndpointDto } from '@/users/infrastructure/schemas';

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	let adminUser: User;

	beforeAll(async () => {
		adminUser =
			await new TestUserRepository().findOrCreateUserWithRoleAndAction(
				RoleType.ADMIN,
				ActionType.WRITE,
			);
	});

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

	it('should return user data when the accessToken is valid', async () => {
		// Given a valid accessToken
		const {
			body: { accessToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		// When making a request to the me endpoint with a valid accessToken
		await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/me')
			.set('Authorization', `Bearer ${accessToken.value}`)
			.expect(HttpStatus.OK)
			.then(response => {
				// Then the response should be an Ok with the user data
				expect(response.body).toEqual<UserEndpointDto>({
					userId: expect.any(String),
					email: adminUser.email,
					firstNameOne: expect.any(String),
					firstNameTwo: expect.any(String),
					lastNameOne: expect.any(String),
					lastNameTwo: expect.any(String),
					createdAt: expect.any(String),
					modifiedAt: expect.any(String),
					roles: expect.any(Array),
					actions: expect.any(Array),
				});
			});
	});

	it('should return 401 Unauthorized when the accessToken is invalid', async () => {
		// When making a request to the me endpoint with an invalid accessToken
		await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/me')
			.set('Authorization', `Bearer invalid-token`)
			.expect(HttpStatus.UNAUTHORIZED)
			.then(response =>
				// Then the response should be an Unauthorized
				expect(response.body).toEqual({
					statusCode: HttpStatus.UNAUTHORIZED,
					message: expect.any(String),
				}),
			);
	});

	it('should return 404 Not Found when the user is not found', async () => {
		// Given a valid accessToken
		const {
			body: { accessToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		jest.spyOn(PrdUserRepository.prototype, 'findByEmail')
			.mockResolvedValueOnce(await userTest1)
			.mockResolvedValueOnce(null);

		// When making a request to the me endpoint and the user is not found
		await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/me')
			.set('Authorization', `Bearer ${accessToken.value}`)
			.expect(HttpStatus.NOT_FOUND)
			.then(response => {
				// Then the response should be a Not Found
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.NOT_FOUND,
						error: UserNotFoundError.code,
					}),
				);
			});
	});

	it('should return 500 Internal Server Error when a RepositoryError is thrown', async () => {
		// Given a valid accessToken
		const {
			body: { accessToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		jest.spyOn(
			PrdUserRepository.prototype,
			'findByEmail',
		).mockRejectedValueOnce(new RepositoryError('Test Error'));

		// When making a request to the me endpoint and a RepositoryError is thrown
		await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/me')
			.set('Authorization', `Bearer ${accessToken.value}`)
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.then(response =>
				// Then the response should be an Internal Server Error
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						error: RepositoryError.code,
					}),
				),
			);
	});
});
