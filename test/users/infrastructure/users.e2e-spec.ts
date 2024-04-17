import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import type { App } from 'supertest/types';

import { db } from '@/db/connection';
import { usersDb } from '@/db/schemas';
import { UsersModule } from '@/users/infrastructure/users.module';

describe('UsersController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [UsersModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', async () => {
		const newUser = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		};

		await request(app.getHttpServer() as App)
			.post('/users')
			.send(newUser)
			.expect(201)
			.then(response => {
				expect(response.body).toEqual({
					id: expect.any(String),
					email: newUser.email,
					createdAt: expect.any(String),
					modifiedAt: expect.any(String),
				});
			});

		await db.delete(usersDb).where(eq(usersDb.email, newUser.email));
	});
});
