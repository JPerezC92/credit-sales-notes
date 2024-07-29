import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { type RefreshPayload, type RefreshTokenCipher } from '@/auth/domain';
import { RefreshTokenCiphrationError } from '@/auth/domain/error';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';

@Injectable()
export class JwtRefreshTokenCipher implements RefreshTokenCipher {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService<EnvVariables>,
	) {}

	encode(payload: RefreshPayload) {
		try {
			return this.jwtService.sign(payload, {
				secret: this.configService.get(
					EnvVariablesEnum.JWT_REFRESH_TOKEN_SECRET,
				),
				expiresIn: '3 days',
			});
		} catch (error) {
			return new RefreshTokenCiphrationError();
		}
	}
}
