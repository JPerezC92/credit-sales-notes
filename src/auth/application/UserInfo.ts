import type { User, UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';

export function UserInfo<UseCaseResult>(
	usersRepository: UsersRepository,
	resultAdapter: (result: User) => UseCaseResult,
) {
	return {
		exec: async (email: User['email']) => {
			const user = await usersRepository.findByEmail(email);

			if (!user) {
				return new UserNotFoundError();
			}

			return resultAdapter(user);
		},
	};
}
