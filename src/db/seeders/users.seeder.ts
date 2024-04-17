import { usersDb } from '@/db/schemas';
import { db } from '@/db/utils/db';
import { UserMother } from '@/test/users/domain';

export async function usersSeeder() {
	await db
		.insert(usersDb)
		.values([UserMother.create(), UserMother.create(), UserMother.create()])
		.execute();
}
