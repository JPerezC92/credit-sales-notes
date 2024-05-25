import type { AuthRepository, AuthUser } from '@/auth/domain';
import { AuthUserNotFoundError } from '@/auth/domain';
import type { User, UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain';

export function UserInfo<UseCaseResult>(
	authRepository: AuthRepository,
	usersRepository: UsersRepository,
	resultAdapter: (result: User) => UseCaseResult,
) {
	return {
		exec: async (email: AuthUser['email']) => {
			const authUser = await authRepository.findUserByEmail(email);

			if (!authUser) {
				return new AuthUserNotFoundError();
			}

			const user = await usersRepository.findByEmail(authUser.email);

			if (!user) {
				return new UserNotFoundError();
			}

			return resultAdapter(user);
		},
	};
}
