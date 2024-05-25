/**
 * Unit tests for the SessionCloser Use Case
 */
import * as crypto from 'node:crypto';

import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { SessionCloser } from '@/auth/application';
import type { AuthRepository } from '@/auth/domain';
import { AuthUserNotFoundError } from '@/auth/domain';
import { AuthUserMother } from '@/test/auth/infrastructure/mothers';

const mockAuthRepository = mock<AuthRepository>();

describe('SessionCloser Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should close the session and update the user', async () => {
		// Given a user with a token
		const ip = faker.internet.ipv4();
		const tokenId = crypto.randomUUID();
		const authUser = await AuthUserMother.create({
			token: new Map([[ip, tokenId]]),
		});

		mockAuthRepository.findUserByEmail.mockResolvedValue(authUser);

		// When the session is closed
		const result = await SessionCloser(mockAuthRepository).exec(
			authUser,
			ip,
		);

		// Then the session is closed and the user is updated
		expect(result).toBeUndefined();
		expect(mockAuthRepository.findUserByEmail).toBeCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toBeCalledWith(
			authUser.email,
		);
		expect(mockAuthRepository.updateAuthUser).toBeCalledTimes(1);
	});

	it('should return an error when the user does not exist', async () => {
		// Given a user that does not exist
		const ip = faker.internet.ipv4();
		const authUser = await AuthUserMother.create();

		mockAuthRepository.findUserByEmail.mockResolvedValue(null);

		// When the session is closed
		const error = await SessionCloser(mockAuthRepository).exec(
			authUser,
			ip,
		);

		// Then an error is returned and the user is not updated
		expect(error).toBeInstanceOf(AuthUserNotFoundError);
		expect(mockAuthRepository.findUserByEmail).toBeCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toBeCalledWith(
			authUser.email,
		);
		expect(mockAuthRepository.updateAuthUser).not.toBeCalled();
	});
});
