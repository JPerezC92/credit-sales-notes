import { userDomainToDbAdapter } from '@/auth/infrastructure/adapters';
import type { CredentialsDto } from '@/auth/infrastructure/schemas';
import * as dbSchemas from '@/db/schemas';
import { db } from '@/db/utils/db';
import { UserMother } from '@/test/users/domain';

export const credentials1: CredentialsDto = {
	email: 'test1@gmail.com',
	password: '123456',
};

export const credentials2: CredentialsDto = {
	email: 'test2@gmail.com',
	password: '123456',
};

export const credentials3: CredentialsDto = {
	email: 'test3@gmail.com',
	password: '123456',
};

export const userTest1 = UserMother.create(credentials1);
export const userTest2 = UserMother.create(credentials2);
export const userTest3 = UserMother.create(credentials3);

export async function usersSeeder() {
	console.log('🛠️ Seeding users');
	console.log(await userTest1);
	await db
		.insert(dbSchemas.userDb)
		.values(
			(await Promise.all([userTest1, userTest2, userTest3])).map(
				userDomainToDbAdapter,
			),
		)
		.execute();

	console.log('✅ Users seeded');
}
