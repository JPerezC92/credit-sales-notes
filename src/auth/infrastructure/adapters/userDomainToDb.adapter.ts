import type { UsersDb } from '@/db/schemas';
import type { User } from '@/users/domain';

export function userDomainToDbAdapter(user: User): UsersDb {
	return {
		userId: user.userId,
		createdAt: user.createdAt,
		modifiedAt: user.modifiedAt,
		email: user.email,
		firstNameOne: user.firstNameOne,
		firstNameTwo: user.firstNameTwo,
		lastNameOne: user.lastNameOne,
		lastNameTwo: user.lastNameTwo,
		password: user.password,
		token: Object.fromEntries(user.token),
	};
}
