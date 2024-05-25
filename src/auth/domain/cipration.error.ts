import { DomainError } from '@/shared/domain';

export class AccessTokenCiphrationError extends DomainError {
	static readonly code = 'ACCESS_TOKEN_CIPRATION_ERROR';
	readonly code = AccessTokenCiphrationError.code;
	readonly name = AccessTokenCiphrationError.name;
	readonly message = 'Error in access token cipration';

	static isInstance(error: unknown): error is AccessTokenCiphrationError {
		return (
			error instanceof AccessTokenCiphrationError &&
			error.code === AccessTokenCiphrationError.code
		);
	}
}

export class RefreshTokenCiphrationError extends DomainError {
	static readonly code = 'REFRESH_TOKEN_CIPRATION_ERROR';
	readonly code = RefreshTokenCiphrationError.code;
	readonly name = RefreshTokenCiphrationError.name;
	readonly message = 'Error in refresh token cipration';

	static isInstance(error: unknown): error is RefreshTokenCiphrationError {
		return (
			error instanceof RefreshTokenCiphrationError &&
			error.code === RefreshTokenCiphrationError.code
		);
	}
}

export class PasswordCiphrationError extends DomainError {
	static code = 'PASSWORD_CIPRATION_ERROR';
	readonly code = PasswordCiphrationError.code;
	readonly name = PasswordCiphrationError.name;
	readonly message = 'Error in password cipration';

	static isInstance(error: unknown): error is PasswordCiphrationError {
		return (
			error instanceof PasswordCiphrationError &&
			error.code === PasswordCiphrationError.code
		);
	}
}
