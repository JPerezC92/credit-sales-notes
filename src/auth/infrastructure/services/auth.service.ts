import {
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

import {
	Authenticathor,
	SessionCloser,
	SessionRevalidator,
} from '@/auth/application';
import { UserInfo } from '@/auth/application/UserInfo';
import {
	AccessTokenCiphrationError,
	InvalidCredentialsError,
	RefreshTokenCiphrationError,
} from '@/auth/domain/error';
import type * as authSchemas from '@/auth/infrastructure/schemas';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import { DomainError } from '@/shared/domain';
import { ExceptionMapper } from '@/shared/infrastructure/errors';
import type { User } from '@/users/domain';
import { UserNotFoundError } from '@/users/domain/error';
import { userModelToEndpoint } from '@/users/infrastructure/adapters';
import { PrdUserRepository } from '@/users/infrastructure/repositories';

import { JwtAccessTokenCipher } from './accessToken.cipher';
import { BcryptPasswordCipher } from './bcryptPassword.cipher';
import { JwtRefreshTokenCipher } from './refreshToken.cipher';

@Injectable()
export class AuthService {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		private readonly passwordCipher: BcryptPasswordCipher,
		private readonly accessTokenCipher: JwtAccessTokenCipher,
		private readonly refreshTokenCipher: JwtRefreshTokenCipher,
		private readonly exceptionMapper: ExceptionMapper,
	) {}

	async login(createAuthDto: authSchemas.CredentialsDto, ip: string) {
		const result = await this.db.transaction(
			async tx =>
				await Authenticathor(
					this.passwordCipher,
					this.accessTokenCipher,
					this.refreshTokenCipher,
					new PrdUserRepository(tx),
				).exec(createAuthDto, ip),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[InvalidCredentialsError.code]: UnauthorizedException,
				[AccessTokenCiphrationError.code]: InternalServerErrorException,
				[RefreshTokenCiphrationError.code]:
					InternalServerErrorException,
			},
		);

		throw httpError();
	}

	async me(email: User['email']) {
		const result = await this.db.transaction(
			async tx =>
				await UserInfo(
					new PrdUserRepository(tx),
					userModelToEndpoint,
				).exec(email),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[UserNotFoundError.code]: NotFoundException,
			},
		);

		throw httpError();
	}

	async refreshToken(email: User['email'], ip: string) {
		const result = await this.db.transaction(
			async tx =>
				await SessionRevalidator(
					new PrdUserRepository(tx),
					this.accessTokenCipher,
					this.refreshTokenCipher,
				).exec(email, ip),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[AccessTokenCiphrationError.code]: InternalServerErrorException,
				[RefreshTokenCiphrationError.code]:
					InternalServerErrorException,
				[UserNotFoundError.code]: NotFoundException,
			},
		);

		throw httpError();
	}

	async logout(authUser: User, ip: string) {
		const result = await this.db.transaction(
			async tx =>
				await SessionCloser(new PrdUserRepository(tx)).exec(
					authUser,
					ip,
				),
		);

		if (!result) return;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[UserNotFoundError.code]: NotFoundException,
			},
		);

		throw httpError();
	}
}
