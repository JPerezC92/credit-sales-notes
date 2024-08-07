import { DomainError, ErrorCodesEnum } from '@/shared/domain';

export class UserNotFoundError extends DomainError {
	static readonly code = ErrorCodesEnum.USERS_NOT_FOUND;
	readonly code = UserNotFoundError.code;
	readonly name = UserNotFoundError.name;
	readonly message = 'User not found';
}
