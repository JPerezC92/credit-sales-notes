import { faker } from '@faker-js/faker';

import { BcryptPasswordCipher } from '@/auth/infrastructure/services';
import { config } from '@/test/users/infrastructure/utils';
import { User } from '@/users/domain';

export const UserMother = {
	async create(params?: Partial<User>): Promise<User> {
		let _params = params;

		if (_params?.password) {
			_params = {
				..._params,
				password: await new BcryptPasswordCipher().encrypt(
					_params.password,
				),
			};
		} else {
			_params = {
				..._params,
				password: await new BcryptPasswordCipher().encrypt(
					config.defaultTestUserPassword,
				),
			};
		}

		return new User({
			userId: faker.string.uuid(),
			firstNameOne: faker.person.firstName(),
			firstNameTwo: faker.person.firstName(),
			lastNameOne: faker.person.lastName(),
			lastNameTwo: faker.person.lastName(),
			email: faker.internet.email(),
			token: new Map(),
			password: await new BcryptPasswordCipher().encrypt(
				config.defaultTestUserPassword,
			),
			createdAt: new Date(),
			modifiedAt: new Date(),
			roles: [],
			actions: [],
			..._params,
		});
	},
};
