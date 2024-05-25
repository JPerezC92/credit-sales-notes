import type {
	AuthRepository,
	AuthUserNewProps,
	PasswordCipher,
} from '@/auth/domain';
import { AuthUser } from '@/auth/domain';

export function AuthUserCreator<UseCaseResult>(
	authRepository: AuthRepository,
	passwordCipher: PasswordCipher,
	resultAdapter: (result: AuthUser) => UseCaseResult,
) {
	return {
		exec: async (authUserNewProps: AuthUserNewProps) => {
			const authUser = await AuthUser.new(
				authUserNewProps,
				passwordCipher,
			);

			await authRepository.saveAuthUser(authUser);

			return resultAdapter(authUser);
		},
	};
}
