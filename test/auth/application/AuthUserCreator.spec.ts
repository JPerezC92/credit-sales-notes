import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { AuthUserCreator } from '@/auth/application';
import type { AuthRepository, AuthUserNewProps } from '@/auth/domain';
import { BcryptPasswordCipher } from '@/auth/infrastructure/services';
import { rawResultAdapter } from '@/shared/application';

const mockAuthRepository = mock<AuthRepository>();

describe('AuthUserCreator use case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should create a new auth user', async () => {
		// Given a valid new auth user props
		const authUserNewProps: AuthUserNewProps = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			userId: faker.string.uuid(),
		};

		mockAuthRepository.saveAuthUser.mockResolvedValueOnce();

		// When attempting to create a new auth user
		const result = await AuthUserCreator(
			mockAuthRepository,
			new BcryptPasswordCipher(),
			rawResultAdapter,
		).exec(authUserNewProps);

		// Then the auth user is created and saved
		expect(result).toEqual({
			...authUserNewProps,
			password: expect.any(String),
			authUserId: expect.any(String),
			token: expect.any(Map),
		});
		expect(mockAuthRepository.saveAuthUser).toHaveBeenCalledTimes(1);
		expect(mockAuthRepository.saveAuthUser).toHaveBeenCalledWith({
			...authUserNewProps,
			password: expect.any(String),
			authUserId: expect.any(String),
			token: expect.any(Map),
		});
	});
});
