import { faker } from '@faker-js/faker';

import type { RoleDb } from '@/db/schemas/role.db';
import { RoleType } from '@/src/roles/domain';

export const RoleDbMother = {
	create(params?: Partial<RoleDb>): RoleDb {
		return {
			roleId: faker.string.uuid(),
			name: RoleType.ADMIN,
			...params,
		};
	},
};
