/**
 * Unit tests for the UserInfo Use Case
 */
import { mock } from 'jest-mock-extended';

import { UserInfo } from '@/auth/application/UserInfo';
import { UserMother } from '@/db/mothers';
import { rawResultAdapter } from '@/shared/application';
import { type UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';

const mockUsersRepository = mock<UsersRepository>();

describe('UserInfo use case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should return the user information', async () => {
		// Given the user is found and the password is correct
		const user = await UserMother.create();

		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the user is found
		const result = await UserInfo(
			mockUsersRepository,
			rawResultAdapter,
		).exec(user.email);

		// Then the user is returned
		expect(result).toEqual(user);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			user.email,
		);
	});

	it('should return an error if the user is not found', async () => {
		// Given the user is not found
		const user = await UserMother.create();

		mockUsersRepository.findByEmail.mockResolvedValueOnce(null);

		// When the user is not found
		const error = await UserInfo(
			mockUsersRepository,
			rawResultAdapter,
		).exec(user.email);

		// Then the error is returned
		expect(error).toBeInstanceOf(UserNotFoundError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			user.email,
		);
	});
});
