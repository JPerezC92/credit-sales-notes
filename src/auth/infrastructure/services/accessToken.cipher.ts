import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { AccessPayload, TokenCipher } from '@/auth/domain';
import type { EnvVariables } from '@/shared/infrastructure/utils';
import { EnvVariablesEnum } from '@/shared/infrastructure/utils';

@Injectable()
export class AccessTokenCipher implements TokenCipher<AccessPayload> {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService<EnvVariables>,
	) {}

	encode(payload: AccessPayload): string {
		return this.jwtService.sign(payload, {
			secret: this.configService.get(
				EnvVariablesEnum.JWT_ACCESSS_TOKEN_SECRET,
			),
			expiresIn: '10h',
		});
	}

	decode(token: string): AccessPayload {
		return this.jwtService.verify<AccessPayload>(token, {
			secret: this.configService.get(
				EnvVariablesEnum.JWT_ACCESSS_TOKEN_SECRET,
			),
		});
	}
}
