import { faker } from '@faker-js/faker';

import type { ActionDb } from '@/db/schemas';
import { ActionType } from '@/src/actions/domain';

export const ActionDbMother = {
	create(params?: Partial<ActionDb>): ActionDb {
		return {
			actionId: faker.string.uuid(),
			name: ActionType.VIEW,
			...params,
		};
	},
};
