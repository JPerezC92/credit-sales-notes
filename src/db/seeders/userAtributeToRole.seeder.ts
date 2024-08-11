import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';
import { RoleType } from '@/src/roles/domain';

export async function userAtributeToRoleSeeder() {
	console.log('🛠️ Seeding user attribute to role relations');

	const roles = await db.query.roleDb.findMany();
	const adminId = roles.find(role => role.name === RoleType.ADMIN)?.roleId;
	const sellerId = roles.find(role => role.name === RoleType.SELLER)?.roleId;

	if (!adminId || !sellerId) {
		throw new Error('');
	}

	const users = await db.query.userDb.findMany();

	await db
		.insert(dbSchemas.userDbToRoleDb)
		.values(
			users
				.map(user => [
					{
						userId: user.userId,
						roleId: adminId,
					},
					{
						userId: user.userId,
						roleId: sellerId,
					},
				])
				.flat(),
		)
		.execute();

	console.log('✅ User attribute to role relations seeded');
}
