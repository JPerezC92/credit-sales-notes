import type { ErrorCodesEnum } from '@/shared/domain';

export abstract class DomainError extends Error {
	abstract readonly code: ErrorCodesEnum;
	abstract readonly message: string;

	static isInstance(error: unknown): error is DomainError {
		return error instanceof DomainError;
	}
}
