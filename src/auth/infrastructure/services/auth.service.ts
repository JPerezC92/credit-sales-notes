import {
	Inject,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';

import { Authenticathor } from '@/auth/application';
import { InvalidCredentialsError } from '@/auth/domain';
import type * as authSchemas from '@/auth/infrastructure/schemas';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import { DomainError } from '@/shared/domain';
import { mapExceptionToHttpError } from '@/shared/infrastructure/errors';

import type { UpdateAuthDto } from '../schemas/update-auth.dto';
import { AccessTokenCipher } from './accessToken.cipher';
import { BcryptPasswordCipher } from './bcryptPassword.cipher';
import { prdAuthRepository } from './prdAuth.repository';
import { RefreshTokenCipher } from './refreshToken.cipher';

@Injectable()
export class AuthService {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		private readonly passwordCipher: BcryptPasswordCipher,
		private readonly accessTokenCipher: AccessTokenCipher,
		private readonly refreshTokenCipher: RefreshTokenCipher,
	) {}

	async login(createAuthDto: authSchemas.CredentialsDto, ip: string) {
		const result = await this.db.transaction(
			async tx =>
				await Authenticathor(
					this.passwordCipher,
					this.accessTokenCipher,
					this.refreshTokenCipher,
					prdAuthRepository(tx),
				).exec(createAuthDto, ip),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = mapExceptionToHttpError([
			[InvalidCredentialsError.name, UnprocessableEntityException],
		]).find(result);

		throw httpError();
	}

	findAll() {
		return `This action returns all auth`;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}
}
