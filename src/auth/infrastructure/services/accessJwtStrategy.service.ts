import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AccessPayload } from '@/auth/domain';
import * as authSchemas from '@/auth/infrastructure/schemas';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';
import type { User } from '@/users/domain';
import { PrdUserRepository } from '@/users/infrastructure/repositories';

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

	async validate(payload: AccessPayload): Promise<User> {
		const _payload = authSchemas.accessPayload.safeParse(payload);

		if (!_payload.success) {
			throw new UnauthorizedException();
		}

		const user = await this.db.transaction(
			async tx =>
				await new PrdUserRepository(tx).findByEmail(
					_payload.data.email,
				),
		);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
