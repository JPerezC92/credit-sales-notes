/**
 * Unit tests for the SessionCloser Use Case
 */
import * as crypto from 'node:crypto';

import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { SessionCloser } from '@/auth/application';
import { UserMother } from '@/db/mothers';
import type { UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';

const mockUsersRepository = mock<UsersRepository>();

describe('SessionCloser Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should close the session and update the user', async () => {
		// Given a user with a token
		const ip = faker.internet.ipv4();
		const tokenId = crypto.randomUUID();
		const user = await UserMother.create({
			token: new Map([[ip, tokenId]]),
		});

		mockUsersRepository.findByEmail.mockResolvedValue(user);

		// When the session is closed
		const result = await SessionCloser(mockUsersRepository).exec(user, ip);

		// Then the session is closed and the user is updated
		expect(result).toBeUndefined();
		expect(mockUsersRepository.findByEmail).toBeCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toBeCalledWith(user.email);
		expect(mockUsersRepository.update).toBeCalledTimes(1);
	});

	it('should return an error when the user does not exist', async () => {
		// Given a user that does not exist
		const ip = faker.internet.ipv4();
		const user = await UserMother.create();

		mockUsersRepository.findByEmail.mockResolvedValue(null);

		// When the session is closed
		const error = await SessionCloser(mockUsersRepository).exec(user, ip);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(UserNotFoundError);
		expect(mockUsersRepository.findByEmail).toBeCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toBeCalledWith(user.email);
		expect(mockUsersRepository.update).not.toBeCalled();
	});
});
