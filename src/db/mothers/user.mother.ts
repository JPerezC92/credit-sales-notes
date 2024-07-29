import { faker } from '@faker-js/faker';

import { User } from '@/users/domain';

export const UserMother = {
	create(params?: Partial<User>): User {
		return new User({
			userId: faker.string.uuid(),
			firstNameOne: faker.person.firstName(),
			firstNameTwo: faker.person.firstName(),
			lastNameOne: faker.person.lastName(),
			lastNameTwo: faker.person.lastName(),
			email: faker.internet.email(),
			createdAt: new Date(),
			modifiedAt: new Date(),
			roles: [],
			actions: [],
			...params,
		});
	},
};
