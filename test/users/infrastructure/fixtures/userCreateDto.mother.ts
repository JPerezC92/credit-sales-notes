import { faker } from '@faker-js/faker';

import type { UserCreateDto } from '@/users/infrastructure/schemas';

export const userCreateDtoMother = {
	create(params?: Partial<UserCreateDto>): UserCreateDto {
		return {
			email: faker.internet.email(),
			password: faker.internet.password(),
			firstNameOne: faker.person.firstName(),
			firstNameTwo: faker.person.firstName(),
			lastNameOne: faker.person.lastName(),
			lastNameTwo: faker.person.lastName(),
			...params,
		};
	},
};
