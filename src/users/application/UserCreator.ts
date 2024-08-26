import { type PasswordCipher } from '@/auth/domain';
import type { UserNewProps, UsersRepository } from '@/users/domain';
import { User } from '@/users/domain';
import { UserEmailAlreadyRegisteredError } from '@/users/domain/error';

export type UserCreatorProps = UserNewProps;

export function UserCreator<UseCaseResult>(
	passwordCipher: PasswordCipher,
	usersRepository: UsersRepository,
	resultAdapter: (result: User) => UseCaseResult,
) {
	return {
		exec: async (props: UserCreatorProps) => {
			const userExists = await usersRepository.findByEmail(props.email);

			if (userExists) {
				return new UserEmailAlreadyRegisteredError(props.email);
			}

			const user = await User.new(props, passwordCipher);

			await usersRepository.save(user);

			return resultAdapter(user);
		},
	};
}
