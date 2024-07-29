import { mock } from 'jest-mock-extended';

import { type AuthRepository } from '@/auth/domain';
import { BcryptPasswordCipher } from '@/auth/infrastructure/services';
import { AuthUserMother } from '@/db/mothers';
import { UserMother } from '@/test/users/domain';
import type { UserCreatorProps } from '@/users/application';
import { UserCreator } from '@/users/application';
import type { UsersRepository } from '@/users/domain';
import { User } from '@/users/domain';
import { UserEmailAlreadyRegisteredError } from '@/users/domain/error';

const mockUsersRepository = mock<UsersRepository>();
const mockAuthRepository = mock<AuthRepository>();

describe('UserCreator Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a new user when valid data is provided', async () => {
		// Given a new user
		const newUser = UserMother.create();
		const newAuthUser = await AuthUserMother.create();

		const userNewProps: UserCreatorProps = {
			email: newUser.email,
			firstNameOne: newUser.firstNameOne,
			firstNameTwo: newUser.firstNameTwo,
			lastNameOne: newUser.lastNameOne,
			lastNameTwo: newUser.lastNameTwo,
			password: newAuthUser.password,
		};

		// When creating a new user
		const user = await UserCreator(
			new BcryptPasswordCipher(),
			mockAuthRepository,
			mockUsersRepository,
			result => result,
		).exec(userNewProps);

		// Then the user should be created
		expect(user).toBeInstanceOf(User);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.saveAuthUser).toHaveBeenCalledTimes(1);
	});

	it('should throw an error when trying to create a user that already exists', async () => {
		// Given a user that already exists
		const newUser = UserMother.create();
		const newAuthUser = await AuthUserMother.create();

		mockUsersRepository.findByEmail.mockResolvedValue(newUser);

		const userNewProps = {
			email: newUser.email,
			firstNameOne: newUser.firstNameOne,
			firstNameTwo: newUser.firstNameTwo,
			lastNameOne: newUser.lastNameOne,
			lastNameTwo: newUser.lastNameTwo,
			password: newAuthUser.password,
		};

		// When attempting to create a new user
		const error = await UserCreator(
			new BcryptPasswordCipher(),
			mockAuthRepository,
			mockUsersRepository,
			result => result,
		).exec(userNewProps);

		// Then an UserEmailAlreadyRegisteredError should be thrown
		expect(error).toBeInstanceOf(UserEmailAlreadyRegisteredError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.save).toHaveBeenCalledTimes(0);
		expect(mockAuthRepository.saveAuthUser).toHaveBeenCalledTimes(0);
	});
});
