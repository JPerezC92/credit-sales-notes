import { RoleType } from '@/auth/domain';
import { RoleDbMother } from '@/db/mothers';
import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';

export async function rolesSeeder() {
	console.log('🛠️ Seeding roles');

	await db
		.insert(dbSchemas.roleDb)
		.values(
			Object.values(RoleType).map(role =>
				RoleDbMother.create({ name: role }),
			),
		)
		.execute();

	console.log('✅ Roles seeded');
}
