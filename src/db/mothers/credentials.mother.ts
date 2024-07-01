import { faker } from '@faker-js/faker';

import type { Credentials } from '@/auth/domain';

export const CredentialsMother = {
	create(params?: Partial<Credentials>): Credentials {
		return {
			email: faker.internet.email(),
			password: faker.internet.password(),
			...params,
		};
	},
};
