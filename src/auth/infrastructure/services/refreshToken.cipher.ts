import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { RefreshPayload, TokenCipher } from '@/auth/domain';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';

@Injectable()
export class RefreshTokenCipher implements TokenCipher<RefreshPayload> {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService<EnvVariables>,
	) {}

	encode(payload: RefreshPayload): string {
		return this.jwtService.sign(payload, {
			secret: this.configService.get(
				EnvVariablesEnum.JWT_REFRESH_TOKEN_SECRET,
			),
			expiresIn: '3 days',
		});
	}

	decode(token: string): RefreshPayload {
		return this.jwtService.verify<RefreshPayload>(token, {
			secret: this.configService.get(
				EnvVariablesEnum.JWT_REFRESH_TOKEN_SECRET,
			),
		});
	}
}
