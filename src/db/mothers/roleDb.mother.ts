import { faker } from '@faker-js/faker';

import { RoleType } from '@/auth/domain';
import type { RoleDb } from '@/db/schemas/role.db';

export const RoleDbMother = {
	create(params?: Partial<RoleDb>): RoleDb {
		return {
			roleId: faker.string.uuid(),
			name: RoleType.ADMIN,
			...params,
		};
	},
};
