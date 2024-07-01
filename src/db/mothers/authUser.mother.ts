import { faker } from '@faker-js/faker';

import type { AuthUserProps } from '@/auth/domain';
import { AuthUser } from '@/auth/domain';
import { BcryptPasswordCipher } from '@/auth/infrastructure/services';

export const AuthUserMother = {
	async create(params?: Partial<AuthUserProps>): Promise<AuthUser> {
		if (params?.password) {
			const { password, ...p } = params;

			return new AuthUser({
				userId: faker.string.uuid(),
				authUserId: faker.string.uuid(),
				token: new Map(),
				email: faker.internet.email(),
				password: await new BcryptPasswordCipher().encrypt(password),
				...p,
			});
		}

		return new AuthUser({
			userId: faker.string.uuid(),
			authUserId: faker.string.uuid(),
			token: new Map(),
			password: await new BcryptPasswordCipher().encrypt(
				faker.internet.password(),
			),
			email: faker.internet.email(),
			...params,
		});
	},
};
