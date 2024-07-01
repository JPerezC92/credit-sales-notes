import { DomainError, ErrorCodesEnum } from '@/shared/domain';

export class AuthUserNotFoundError extends DomainError {
	static readonly code = ErrorCodesEnum.AUTH_USER_NOT_FOUND;
	readonly code = AuthUserNotFoundError.code;
	readonly name = AuthUserNotFoundError.name;
	readonly message = 'User not found';

	static isInstance(error: unknown): error is AuthUserNotFoundError {
		return (
			error instanceof AuthUserNotFoundError &&
			error.code === AuthUserNotFoundError.code
		);
	}
}
