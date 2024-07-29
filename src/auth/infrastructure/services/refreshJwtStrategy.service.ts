import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import IP from 'ip';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AuthUser, RefreshPayload } from '@/auth/domain';
import { authUserDbToDomainAdapter } from '@/auth/infrastructure/adapters';
import * as authSchemas from '@/auth/infrastructure/schemas';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';

export const refreshTokenStrategy = 'RefreshTokenStrategy';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	refreshTokenStrategy,
) {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		_configService: ConfigService<EnvVariables>,
	) {
		super({
			passReqToCallback: false,
			jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'),
			ignoreExpiration: false,
			secretOrKey: _configService.get(
				EnvVariablesEnum.JWT_REFRESH_TOKEN_SECRET,
			),
		});
	}

	async validate(payload: RefreshPayload): Promise<AuthUser> {
		const payloadValidation = authSchemas.refreshPayload.safeParse(payload);

		if (!payloadValidation.success) {
			throw new UnauthorizedException();
		}

		const payloadValidated = payloadValidation.data;

		const result = await this.db.query.userDb.findFirst({
			where: (users, { eq }) =>
				eq(users.email, payloadValidation.data.email),
			with: { authUser: true },
		});

		if (!result?.authUser) {
			throw new UnauthorizedException();
		}

		const authUser = authUserDbToDomainAdapter(
			result.authUser,
			result.email,
		);
		const ip = IP.address();

		if (authUser.token.get(ip) !== payloadValidated.tokenId) {
			throw new UnauthorizedException();
		}

		return authUser;
	}
}
