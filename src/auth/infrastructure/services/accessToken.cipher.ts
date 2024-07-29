import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { AccessPayload, AccessTokenCipher } from '@/auth/domain';
import { AccessTokenCiphrationError } from '@/auth/domain/error';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';

@Injectable()
export class JwtAccessTokenCipher implements AccessTokenCipher {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService<EnvVariables>,
	) {}

	encode(payload: AccessPayload) {
		try {
			return this.jwtService.sign(payload, {
				secret: this.configService.get(
					EnvVariablesEnum.JWT_ACCESSS_TOKEN_SECRET,
				),
				expiresIn: '10h',
			});
		} catch (error) {
			return new AccessTokenCiphrationError();
		}
	}
}
