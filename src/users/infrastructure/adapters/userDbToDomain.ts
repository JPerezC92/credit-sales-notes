import type { UsersDb } from '@/db/schemas';
import { User } from '@/users/domain';

export function userDbToDomain(user: UsersDb): User {
	return new User({
		userId: user.userId,
		firstNameOne: user.firstNameOne,
		firstNameTwo: user.firstNameTwo ?? '',
		lastNameOne: user.lastNameOne,
		lastNameTwo: user.lastNameTwo ?? '',
		email: user.email,
		createdAt: user.createdAt,
		modifiedAt: user.modifiedAt,
	});
}
