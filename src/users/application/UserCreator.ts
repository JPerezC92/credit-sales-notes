import type { AuthRepository, PasswordCipher } from '@/auth/domain';
import { AuthUser } from '@/auth/domain';
import type { UserNewProps, UsersRepository } from '@/users/domain';
import { User, UserEmailAlreadyRegisteredError } from '@/users/domain';

export type UserCreatorProps = UserNewProps & {
	password: AuthUser['password'];
};

export function UserCreator<UseCaseResult>(
	passwordCipher: PasswordCipher,
	authRepository: AuthRepository,
	usersRepository: UsersRepository,
	resultAdapter: (result: User) => UseCaseResult,
) {
	return {
		exec: async (props: UserCreatorProps) => {
			const userExists = await usersRepository.findByEmail(props.email);

			if (userExists) {
				return new UserEmailAlreadyRegisteredError(props.email);
			}

			const user = User.new(props);

			const authUser = await AuthUser.new(
				{
					password: props.password,
					userId: user.userId,
					email: user.email,
				},
				passwordCipher,
			);

			await Promise.all([
				authRepository.saveUser(authUser),
				usersRepository.save(user),
			]);

			return resultAdapter(user);
		},
	};
}
