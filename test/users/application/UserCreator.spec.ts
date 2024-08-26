import { mock } from 'jest-mock-extended';

import { BcryptPasswordCipher } from '@/auth/infrastructure/services';
import { rawResultAdapter } from '@/shared/application';
import { UserMother } from '@/test/users/domain';
import type { UserCreatorProps } from '@/users/application';
import { UserCreator } from '@/users/application';
import type { UsersRepository } from '@/users/domain';
import { User } from '@/users/domain';
import { UserEmailAlreadyRegisteredError } from '@/users/domain/error';

const mockUsersRepository = mock<UsersRepository>();

describe('UserCreator Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a new user when valid data is provided', async () => {
		// Given a new user
		const newUser = await UserMother.create();

		const userNewProps: UserCreatorProps = {
			email: newUser.email,
			firstNameOne: newUser.firstNameOne,
			firstNameTwo: newUser.firstNameTwo,
			lastNameOne: newUser.lastNameOne,
			lastNameTwo: newUser.lastNameTwo,
			password: newUser.password,
		};

		// When creating a new user
		const user = await UserCreator(
			new BcryptPasswordCipher(),
			mockUsersRepository,
			result => result,
		).exec(userNewProps);

		// Then the user should be created
		expect(user).toBeInstanceOf(User);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
	});

	it('should throw an error when trying to create a user that already exists', async () => {
		// Given a user that already exists
		const newUser = await UserMother.create();

		mockUsersRepository.findByEmail.mockResolvedValue(newUser);

		const userNewProps = {
			email: newUser.email,
			firstNameOne: newUser.firstNameOne,
			firstNameTwo: newUser.firstNameTwo,
			lastNameOne: newUser.lastNameOne,
			lastNameTwo: newUser.lastNameTwo,
			password: newUser.password,
		};

		// When attempting to create a new user
		const error = await UserCreator(
			new BcryptPasswordCipher(),
			mockUsersRepository,
			rawResultAdapter,
		).exec(userNewProps);

		// Then an UserEmailAlreadyRegisteredError should be thrown
		expect(error).toBeInstanceOf(UserEmailAlreadyRegisteredError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.save).toHaveBeenCalledTimes(0);
	});
});
