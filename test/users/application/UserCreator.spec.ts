import { mock } from 'jest-mock-extended';

import { type AuthRepository } from '@/auth/domain';
import { BcryptPasswordCipher } from '@/auth/infrastructure/services';
import { AuthUserMother } from '@/test/auth/infrastructure/fixtures';
import { UserMother } from '@/test/users/domain';
import type { UserCreatorProps } from '@/users/application';
import { UserCreator } from '@/users/application';
import type { UsersRepository } from '@/users/domain';
import { User, UserEmailAlreadyRegisteredError } from '@/users/domain';

const mockUsersRepository = mock<UsersRepository>();
const mockAuthRepository = mock<AuthRepository>();

describe('UserCreator Use Case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create a new user', async () => {
		// GIVEN
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

		// WHEN
		const result = await UserCreator(
			new BcryptPasswordCipher(),
			mockAuthRepository,
			mockUsersRepository,
			result => result,
		).exec(userNewProps);

		// THEN
		expect(result).toBeInstanceOf(User);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.saveUser).toHaveBeenCalledTimes(1);
	});

	it('should throw an error if the user already exists', async () => {
		// GIVEN
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

		// WHEN
		const result = await UserCreator(
			new BcryptPasswordCipher(),
			mockAuthRepository,
			mockUsersRepository,
			result => result,
		).exec(userNewProps);

		// THEN
		expect(result).toBeInstanceOf(UserEmailAlreadyRegisteredError);
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.save).toHaveBeenCalledTimes(0);
		expect(mockAuthRepository.saveUser).toHaveBeenCalledTimes(0);
	});
});
