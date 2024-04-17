import { ConflictException, Inject, Injectable } from '@nestjs/common';

import {
	BcryptPasswordCipher,
	prdAuthRepository,
} from '@/auth/infrastructure/services';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import { DomainError } from '@/shared/domain';
import { mapExceptionToHttpError } from '@/shared/infrastructure/errors';
import { UserCreator } from '@/users/application';
import { UserEmailAlreadyRegisteredError } from '@/users/domain';
import { userModelToEndpoint } from '@/users/infrastructure/adapters';
import { prdUserRepository } from '@/users/infrastructure/repositories';
import type * as userSchemas from '@/users/infrastructure/schemas';

@Injectable()
export class UsersService {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		private readonly passwordCipher: BcryptPasswordCipher,
	) {}

	async create(
		userCreateDto: userSchemas.UserCreateDto,
	): Promise<userSchemas.UserEndpointDto> {
		const result = await this.db.transaction(
			async tx =>
				await UserCreator(
					this.passwordCipher,
					prdAuthRepository(tx),
					prdUserRepository(tx),
					userModelToEndpoint,
				).exec(userCreateDto),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = mapExceptionToHttpError([
			[UserEmailAlreadyRegisteredError.name, ConflictException],
		]).find(result);

		throw httpError();
	}

	async findByEmail(
		email: string,
	): Promise<userSchemas.UserEndpointDto | null> {
		return await this.db.transaction(
			async tx => await prdUserRepository(tx).findByEmail(email),
		);
	}
}
