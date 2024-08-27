import type { User, UsersRepository } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';

export function SessionCloser(authRepository: UsersRepository) {
	return {
		exec: async (authUser: User, ip: string) => {
			const user = await authRepository.findByEmail(authUser.email);

			if (!user) {
				return new UserNotFoundError();
			}

			const userUpdated = user.removeToken(ip);

			await authRepository.update(userUpdated);
		},
	};
}
