/**
 * This file contains end-to-end tests for the UsersController.
 * It tests the users interactions with the /users endpoint.
 */

import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { RepositoryError } from '@/shared/domain';
import { versioningConfig } from '@/shared/infrastructure/utils';
import { ActionType } from '@/src/actions/domain';
import { PrdRolesRepository, Role, RoleType } from '@/src/roles/domain';
import { ErrorResponseExpected } from '@/test/shared/infrastructure/fixtures';
import { userCreateDtoMother } from '@/test/users/infrastructure/fixtures';
import { TestUserRepository } from '@/test/users/infrastructure/utils';
import { config } from '@/test/users/infrastructure/utils/config';
import type { User } from '@/users/domain';
import { UserEmailAlreadyRegisteredError } from '@/users/domain/error';
import { PrdUserRepository } from '@/users/infrastructure/repositories';
import type {
	UserCreateDto,
	UserEndpointDto,
} from '@/users/infrastructure/schemas';
import { UsersModule } from '@/users/infrastructure/users.module';

describe('UsersController (e2e)', () => {
	let app: INestApplication;
	let newUser: UserCreateDto;

	let adminUser: User;

	beforeAll(async () => {
		newUser = userCreateDtoMother.create({
			password: config.defaultTestUserPassword,
		});

		adminUser =
			await new TestUserRepository().findOrCreateUserWithRoleAndAction(
				RoleType.ADMIN,
				ActionType.WRITE,
			);
	});

	beforeEach(async () => {
		jest.clearAllMocks();

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [UsersModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.enableVersioning(versioningConfig);
		await app.init();
	});

	it('should create a new user', async () => {
		// Given authenticated as an admin

		const response = await request(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		// When attempting to create a new user
		await request(app.getHttpServer() as App)
			.post('/api/v1/users')
			.set('Authorization', `Bearer ${response.body.accessToken.value}`)
			.send(newUser)
			.expect(HttpStatus.CREATED)
			.then(response => {
				// Then the user should be created successfully
				expect(response.body).toEqual<UserEndpointDto>({
					userId: expect.any(String),
					firstNameOne: newUser.firstNameOne,
					firstNameTwo: newUser.firstNameTwo,
					lastNameOne: newUser.lastNameOne,
					lastNameTwo: newUser.lastNameTwo,
					email: newUser.email,
					createdAt: expect.any(String),
					modifiedAt: expect.any(String),
					roles: expect.any(Array),
					actions: expect.any(Array),
				});
			});
	});

	it('should not create a user when the user that is trying to register is not an admin', async () => {
		// Given authenticated
		const response = await request(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		jest.spyOn(
			PrdRolesRepository.prototype,
			'findRolesByUserId',
		).mockResolvedValueOnce([
			new Role({ roleId: '1', name: RoleType.SELLER }),
		]);

		// When attempting to create a new user with an existing email
		await request(app.getHttpServer() as App)
			.post('/api/v1/users')
			.set('Authorization', `Bearer ${response.body.accessToken.value}`)
			.send(newUser)
			.expect(HttpStatus.FORBIDDEN)
			.then(response => {
				// Then a forbidden error should be returned
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.FORBIDDEN,
					}),
				);
			});
	});

	it('should return a forbidden error when trying to create a user without a write action', async () => {
		// Given authenticated as an user without a write action
		const user =
			await new TestUserRepository().findOrCreateUserWithRoleAndAction(
				RoleType.ADMIN,
				ActionType.VIEW,
			);
		const newUser = userCreateDtoMother.create();

		const response = await request(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: user.email,
				password: config.defaultTestUserPassword,
			});

		// When attempting to create a new user with an existing email
		await request(app.getHttpServer() as App)
			.post('/api/v1/users')
			.set('Authorization', `Bearer ${response.body.accessToken.value}`)
			.send(newUser)
			.expect(HttpStatus.FORBIDDEN)
			.then(response => {
				// Then a conflict error should be returned

				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.FORBIDDEN,
					}),
				);
			});
	});

	it('should return a conflict error when trying to create a user with an existing email', async () => {
		// Given authenticated as an admin
		const response = await request(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		// When attempting to create a new user with an existing email
		await request(app.getHttpServer() as App)
			.post('/api/v1/users')
			.set('Authorization', `Bearer ${response.body.accessToken.value}`)
			.send(newUser)
			.expect(HttpStatus.CONFLICT)
			.then(response => {
				// Then a conflict error should be returned
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.CONFLICT,
						error: UserEmailAlreadyRegisteredError.code,
					}),
				);
			});
	});

	it('should return a internal server error when a repository error occurs', async () => {
		// Given authenticated as an admin
		const response = await request(app.getHttpServer() as App)
			.post('/api/v1/auth')
			.send({
				email: adminUser.email,
				password: config.defaultTestUserPassword,
			});

		jest.spyOn(PrdUserRepository.prototype, 'save').mockRejectedValueOnce(
			new RepositoryError('Test Error'),
		);

		// When attempting to create a new user with an existing email
		await request(app.getHttpServer() as App)
			.post('/api/v1/users')
			.set('Authorization', `Bearer ${response.body.accessToken.value}`)
			.send(userCreateDtoMother.create())
			.expect(HttpStatus.INTERNAL_SERVER_ERROR)
			.then(response => {
				// Then a conflict error should be returned
				expect(response.body).toEqual(
					ErrorResponseExpected.create({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						error: RepositoryError.code,
					}),
				);
			});
	});
});
