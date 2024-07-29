import * as crypto from 'node:crypto';

import type { Role2 } from '@/auth/domain';
import { AttributeType, RoleType } from '@/auth/domain';

export const RoleMother = {
	create(params?: Partial<Role2>): Role2 {
		return {
			userAttributeId: crypto.randomUUID(),
			type: AttributeType.rol,
			value: RoleType.ADMIN,
			...params,
		};
	},
};
