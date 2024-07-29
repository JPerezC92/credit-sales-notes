import { AuthUserCreator } from '@/auth/application';
import {
	type AuthRepository,
	type AuthUser,
	type PasswordCipher,
} from '@/auth/domain';
import { rawResultAdapter } from '@/shared/application';
import type { UserNewProps, UsersRepository } from '@/users/domain';
import { User } from '@/users/domain';
import { UserEmailAlreadyRegisteredError } from '@/users/domain/error';

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

			const authUser = AuthUserCreator(
				authRepository,
				passwordCipher,
				rawResultAdapter,
			);

			await Promise.all([
				authUser.exec({
					email: user.email,
					password: props.password,
					userId: user.userId,
				}),
				usersRepository.save(user),
			]);

			return resultAdapter(user);
		},
	};
}
