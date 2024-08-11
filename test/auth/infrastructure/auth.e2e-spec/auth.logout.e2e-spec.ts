/**
 * This file contains end-to-end tests for the AuthController.
 * It tests the authentication and authorization functionality of the application.
 */
import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { ReasonPhrases } from 'http-status-codes';
import supertest from 'supertest';
import type { App } from 'supertest/types';

import { AuthModule } from '@/auth/infrastructure/auth.module';
import { PrdAuthRepository } from '@/auth/infrastructure/services';
import { RepositoryError } from '@/shared/domain';
import { versioningConfig } from '@/shared/infrastructure/utils';
import { ActionType } from '@/src/actions/domain';
import { RoleType } from '@/src/roles/domain';
import { ErrorResponseExpected } from '@/test/shared/infrastructure/fixtures';
import { config, TestUserRepository } from '@/test/users/infrastructure/utils';
import type { User } from '@/users/domain';

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

	it('should invalidate the refreshToken when the accessToken is used to logout', async () => {
		// Given a valid accessToken and refreshToken
		const {
			body: { accessToken, refreshToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		// When the accessToken is used to logout
		await supertest(app.getHttpServer() as App)
			.delete('/api/v1/auth/logout')
			.set('Authorization', `Bearer ${accessToken.value}`)
			.expect(HttpStatus.NO_CONTENT);

		// Then the refreshToken should be invalidated
		const response = await supertest(app.getHttpServer() as App)
			.get('/api/v1/auth/refresh-token')
			.set('x-refresh-token', `${refreshToken.value}`);

		// Then the response should be an Unauthorized
		expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
		expect(response.body).toEqual({
			statusCode: HttpStatus.UNAUTHORIZED,
			message: ReasonPhrases.UNAUTHORIZED,
		});
	});

	it('should handle an Internal Server Error when a Repository fails', async () => {
		// Given a valid accessToken
		const {
			body: { accessToken },
		} = await supertest(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		// Mock the AuthRepository to throw an error
		jest.spyOn(
			PrdAuthRepository.prototype,
			'updateAuthUser',
		).mockRejectedValueOnce(new RepositoryError("Can't save the AuthUser"));

		// When the accessToken is used to logout
		const response = await supertest(app.getHttpServer() as App)
			.delete('/api/v1/auth/logout')
			.set('Authorization', `Bearer ${accessToken.value}`);

		// Then the response should be an Internal Server Error
		expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
		expect(response.body).toEqual(
			ErrorResponseExpected.create({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				error: RepositoryError.code,
			}),
		);
	});
});
