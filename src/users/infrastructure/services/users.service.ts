import { ConflictException, Inject, Injectable } from '@nestjs/common';

import {
	BcryptPasswordCipher,
	PrdAuthRepository,
} from '@/auth/infrastructure/services';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import { DomainError } from '@/shared/domain';
import { ExceptionMapper } from '@/shared/infrastructure/errors';
import { UserCreator } from '@/users/application';
import { UserEmailAlreadyRegisteredError } from '@/users/domain/error';
import { userModelToEndpoint } from '@/users/infrastructure/adapters';
import { prdUserRepository } from '@/users/infrastructure/repositories';
import type * as userSchemas from '@/users/infrastructure/schemas';

@Injectable()
export class UsersService {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		private readonly passwordCipher: BcryptPasswordCipher,
		private readonly exceptionMapper: ExceptionMapper,
	) {}

	async create(
		userCreateDto: userSchemas.UserCreateDto,
	): Promise<userSchemas.UserEndpointDto> {
		const result = await this.db.transaction(
			async tx =>
				await UserCreator(
					this.passwordCipher,
					new PrdAuthRepository(tx),
					prdUserRepository(tx),
					userModelToEndpoint,
				).exec(userCreateDto),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[UserEmailAlreadyRegisteredError.code]: ConflictException,
			},
		);

		throw httpError();
	}
}
