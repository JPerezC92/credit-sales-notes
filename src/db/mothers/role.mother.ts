import * as crypto from 'node:crypto';

import type { Properties } from '@/shared/domain';
import { Role, RoleType } from '@/src/roles/domain';

export const RoleMother = {
	create(params?: Partial<Properties<Role>>): Role {
		return new Role({
			roleId: crypto.randomUUID(),
			name: RoleType.ADMIN,
			...params,
		});
	},
};
