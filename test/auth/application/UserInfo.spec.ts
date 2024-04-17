/**
 * Unit tests for the UserInfo Use Case
 */
import { mock } from 'jest-mock-extended';

import { UserInfo } from '@/auth/application/UserInfo';
import type { AuthRepository } from '@/auth/domain';
import { AuthUserNotFoundError } from '@/auth/domain';
import { rawResultAdapter } from '@/shared/application';
import { AuthUserMother } from '@/test/auth/infrastructure/mothers';
import { UserMother } from '@/test/users/domain';
import { UserNotFoundError, type UsersRepository } from '@/users/domain';

const mockAuthRepository = mock<AuthRepository>();
const mockUsersRepository = mock<UsersRepository>();

describe('UserInfo use case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should return the user information', async () => {
		// Given the user is found and the password is correct
		const user = UserMother.create();
		const authUser = await AuthUserMother.create({
			email: user.email,
			authUserId: user.userId,
		});
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);
		mockUsersRepository.findByEmail.mockResolvedValueOnce(user);

		// When the user is found
		const result = await UserInfo(
			mockAuthRepository,
			mockUsersRepository,
			rawResultAdapter,
		).exec(authUser.email);

		// Then the user is returned
		expect(result).toEqual(user);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
	});

	it('should return an error if the auth user is not found', async () => {
		// Given the auth user is not found
		const authUser = await AuthUserMother.create();
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(null);

		// When the user tries to get his information
		const error = await UserInfo(
			mockAuthRepository,
			mockUsersRepository,
			rawResultAdapter,
		).exec(authUser.email);

		// Then an error is returned
		expect(error).toBeInstanceOf(AuthUserNotFoundError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
		expect(mockUsersRepository.findByEmail).not.toHaveBeenCalled();
	});

	it('should return an error if the user is not found', async () => {
		// Given the user is not found
		const authUser = await AuthUserMother.create();
		mockAuthRepository.findUserByEmail.mockResolvedValueOnce(authUser);
		mockUsersRepository.findByEmail.mockResolvedValueOnce(null);

		// When the user is not found
		const error = await UserInfo(
			mockAuthRepository,
			mockUsersRepository,
			rawResultAdapter,
		).exec(authUser.email);

		// Then the error is returned
		expect(error).toBeInstanceOf(UserNotFoundError);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			authUser.email,
		);
	});
});
