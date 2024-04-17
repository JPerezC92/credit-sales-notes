import type { CredentialsDto } from '@/auth/infrastructure/schemas';
import { AuthUserMother } from '@/test/auth/infrastructure/mothers';
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
