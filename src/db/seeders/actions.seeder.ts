import { ActionType } from '@/auth/domain';
import { ActionDbMother } from '@/db/mothers';
import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';

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
