import { faker } from '@faker-js/faker';

import { ActionType } from '@/auth/domain';
import type { ActionDb } from '@/db/schemas';

export const ActionDbMother = {
	create(params?: Partial<ActionDb>): ActionDb {
		return {
			actionId: faker.string.uuid(),
			name: ActionType.VIEW,
			...params,
		};
	},
};
