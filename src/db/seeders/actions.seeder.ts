import { ActionDbMother } from '@/db/mothers';
import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';
import { ActionType } from '@/src/actions/domain';

export const actionsSeeder = async () => {
	console.log('🛠️ Seeding actions');

	await db
		.insert(dbSchemas.actionDb)
		.values(
			Object.values(ActionType).map(action =>
				ActionDbMother.create({ name: action }),
			),
		)
		.execute();

	console.log('✅ Actions seeded');
};
