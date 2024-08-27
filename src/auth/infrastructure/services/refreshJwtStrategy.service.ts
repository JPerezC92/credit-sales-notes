import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import IP from 'ip';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { RefreshPayload } from '@/auth/domain';
import * as authSchemas from '@/auth/infrastructure/schemas';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';
import type { User } from '@/users/domain';
import { userDbToDomain } from '@/users/infrastructure/adapters';

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

	async validate(payload: RefreshPayload): Promise<User> {
		const payloadValidation = authSchemas.refreshPayload.safeParse(payload);

		if (!payloadValidation.success) {
			throw new UnauthorizedException();
		}

		const payloadValidated = payloadValidation.data;

		const result = await this.db.query.userDb.findFirst({
			where: (users, { eq }) =>
				eq(users.email, payloadValidation.data.email),
			with: {
				userToAction: true,
				userToRole: true,
			},
		});

		if (!result) {
			throw new UnauthorizedException();
		}

		const user = userDbToDomain(
			result,
			result.userToRole.map(({ roleId }) => roleId),
			result.userToAction.map(({ actionId }) => actionId),
		);
		const ip = IP.address();

		if (user.token.get(ip) !== payloadValidated.tokenId) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
