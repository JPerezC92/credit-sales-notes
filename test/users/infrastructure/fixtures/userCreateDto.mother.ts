import { faker } from '@faker-js/faker';

import { config } from '@/test/users/infrastructure/utils';
import type { UserCreateDto } from '@/users/infrastructure/schemas';

export const userCreateDtoMother = {
	create(params?: Partial<UserCreateDto>): UserCreateDto {
		return {
			email: faker.internet.email(),
			firstNameOne: faker.person.firstName(),
			firstNameTwo: faker.person.firstName(),
			lastNameOne: faker.person.lastName(),
			lastNameTwo: faker.person.lastName(),
			password: config.defaultTestUserPassword,
			...params,
		};
	},
};
