import { authUserDomainToDbAdapter } from '@/auth/infrastructure/adapters';
import type { CredentialsDto } from '@/auth/infrastructure/schemas';
import { AuthUserMother } from '@/db/mothers';
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

export const authUser1 = AuthUserMother.create({
	password: credentials1.password,
	userId: userTest1.userId,
});

export const authUser2 = AuthUserMother.create({
	password: credentials2.password,
	userId: userTest2.userId,
});

export const authUser3 = AuthUserMother.create({
	password: credentials3.password,
	userId: userTest3.userId,
});

export async function usersSeeder() {
	console.log('🛠️ Seeding users');

	await db
		.insert(dbSchemas.userDb)
		.values([userTest1, userTest2, userTest3])
		.execute();

	const authUserDbList = await Promise.all([authUser1, authUser2, authUser3]);

	await db
		.insert(dbSchemas.authUserDb)
		.values(authUserDbList.map(authUserDomainToDbAdapter))
		.execute();

	console.log('✅ Users seeded');
}
