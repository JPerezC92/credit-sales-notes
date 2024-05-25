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
import type { AuthUser } from '@/auth/domain';
import {
	AccessTokenCiphrationError,
	AuthUserNotFoundError,
	InvalidCredentialsError,
	RefreshTokenCiphrationError,
} from '@/auth/domain';
import type * as authSchemas from '@/auth/infrastructure/schemas';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import { DomainError } from '@/shared/domain';
import { ExceptionMapper } from '@/shared/infrastructure/errors';
import { UserNotFoundError } from '@/users/domain';
import { userModelToEndpoint } from '@/users/infrastructure/adapters';
import { prdUserRepository } from '@/users/infrastructure/repositories';

import { JwtAccessTokenCipher } from './accessToken.cipher';
import { BcryptPasswordCipher } from './bcryptPassword.cipher';
import { PrdAuthRepository } from './prdAuth.repository';
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
					new PrdAuthRepository(tx),
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

	async me(user: AuthUser) {
		const result = await this.db.transaction(
			async tx =>
				await UserInfo(
					new PrdAuthRepository(tx),
					prdUserRepository(tx),
					userModelToEndpoint,
				).exec(user.email),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[AuthUserNotFoundError.code]: NotFoundException,
				[UserNotFoundError.code]: NotFoundException,
			},
		);

		throw httpError();
	}

	async refreshToken(authUser: AuthUser, ip: string) {
		const result = await this.db.transaction(
			async tx =>
				await SessionRevalidator(
					new PrdAuthRepository(tx),
					this.accessTokenCipher,
					this.refreshTokenCipher,
				).exec(authUser.email, ip),
		);

		if (!DomainError.isInstance(result)) return result;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[AccessTokenCiphrationError.code]: InternalServerErrorException,
				[RefreshTokenCiphrationError.code]:
					InternalServerErrorException,
				[AuthUserNotFoundError.code]: NotFoundException,
			},
		);

		throw httpError();
	}

	async logout(authUser: AuthUser, ip: string) {
		const result = await this.db.transaction(
			async tx =>
				await SessionCloser(new PrdAuthRepository(tx)).exec(
					authUser,
					ip,
				),
		);

		if (!result) return;

		const httpError = this.exceptionMapper.mapDomainErrorToHttpException(
			result,
			{
				[AuthUserNotFoundError.code]: NotFoundException,
			},
		);

		throw httpError();
	}
}
