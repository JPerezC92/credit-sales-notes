import type { ActionDb, RoleDb, UsersDb } from '@/db/schemas';
import { User } from '@/users/domain';

export function userDbToDomain(
	user: UsersDb,
	roles: Array<RoleDb['roleId']>,
	actions: Array<ActionDb['actionId']>,
): User {
	return new User({
		userId: user.userId,
		firstNameOne: user.firstNameOne,
		firstNameTwo: user.firstNameTwo ?? '',
		lastNameOne: user.lastNameOne,
		lastNameTwo: user.lastNameTwo ?? '',
		password: user.password,
		token: new Map(Object.entries(user.token)),
		email: user.email,
		createdAt: user.createdAt,
		modifiedAt: user.modifiedAt,
		roles,
		actions,
	});
}
