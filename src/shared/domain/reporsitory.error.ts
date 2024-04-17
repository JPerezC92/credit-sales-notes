import { DomainError } from '@/shared/domain';

export class RepositoryError extends DomainError {
	static readonly code = 'REPOSITORY_ERROR';
	readonly code = RepositoryError.code;
	readonly name = RepositoryError.name;
	readonly message = 'An error occurred while accessing the information.';
	readonly originalError: unknown;

	constructor(error: unknown) {
		super();
		this.originalError = error;
	}

	static isInstance(error: unknown): error is RepositoryError {
		return (
			error instanceof RepositoryError &&
			error.code === RepositoryError.code
		);
	}
}
