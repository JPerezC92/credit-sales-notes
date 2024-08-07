import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AccessPayload, AuthUser } from '@/auth/domain';
import * as authSchemas from '@/auth/infrastructure/schemas';
import { PrdAuthRepository } from '@/auth/infrastructure/services/prdAuth.repository';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';

export const accessTokenStrategy = 'AccessTokenStrategy';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
	Strategy,
	accessTokenStrategy,
) {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		configService: ConfigService<EnvVariables>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(
				EnvVariablesEnum.JWT_ACCESSS_TOKEN_SECRET,
			),
		});
	}

	async validate(payload: AccessPayload): Promise<AuthUser> {
		const _payload = authSchemas.accessPayload.safeParse(payload);

		if (!_payload.success) {
			throw new UnauthorizedException();
		}

		const authUser = await this.db.transaction(
			async tx =>
				await new PrdAuthRepository(tx).findUserByEmail(
					_payload.data.email,
				),
		);

		if (!authUser) {
			throw new UnauthorizedException();
		}

		return authUser;
	}
}
