export abstract class DomainError extends Error {
	abstract readonly code;
	abstract readonly message: string;
	abstract readonly name: string;

	static isInstance(error: unknown): error is DomainError {
		return error instanceof DomainError;
	}
}
