import { authUserDomainToDbAdapter } from '@/auth/infrastructure/adapters';
import { authUserDb, usersDb } from '@/db/schemas';
import { db } from '@/db/utils/db';
import {
	authUser1,
	authUser2,
	authUser3,
	userTest1,
	userTest2,
	userTest3,
} from '@/test/users/infrastructure/fixtures';

export async function usersSeeder() {
	await db
		.insert(usersDb)
		.values([userTest1, userTest2, userTest3])
		.execute();

	const authUserDbList = await Promise.all([authUser1, authUser2, authUser3]);

	await db
		.insert(authUserDb)
		.values(authUserDbList.map(authUserDomainToDbAdapter))
		.execute();
}
