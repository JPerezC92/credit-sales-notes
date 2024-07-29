import { ActionType } from '@/auth/domain';
import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';

export async function userAtributeToActionSeeder() {
	console.log('🛠️ Seeding user attribute to action relations');

	const actions = await db.query.actionDb.findMany();
	const viewId = actions.find(action => action.name === ActionType.VIEW)
		?.actionId;
	const editId = actions.find(action => action.name === ActionType.EDIT)
		?.actionId;
	const deleteId = actions.find(action => action.name === ActionType.DELETE)
		?.actionId;

	if (!viewId || !editId || !deleteId) {
		throw new Error('Actions not found');
	}

	const users = await db.query.userDb.findMany();

	await db
		.insert(dbSchemas.userDbToActionDb)
		.values(
			users
				.map(user => [
					{
						userId: user.userId,
						actionId: viewId,
					},
					{
						userId: user.userId,
						actionId: editId,
					},
					{
						userId: user.userId,
						actionId: deleteId,
					},
				])
				.flat(),
		)
		.execute();

	console.log('✅ User attribute to action relations seeded');
}
