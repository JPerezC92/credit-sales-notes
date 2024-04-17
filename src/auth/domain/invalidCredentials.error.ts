import { DomainError } from '@/shared/domain';

export class InvalidCredentialsError extends DomainError {
	readonly code = 'INVALID_CREDENTIALS';
	readonly name = InvalidCredentialsError.name;
	readonly message = 'Invalid credentials';

	static isInstance(error: unknown): error is InvalidCredentialsError {
		return error instanceof InvalidCredentialsError;
	}
}
