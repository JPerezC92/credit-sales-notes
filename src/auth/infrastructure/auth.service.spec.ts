import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import {
	AuthService,
	BcryptPasswordCipher,
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { DatabaseModule } from '@/db/database.module';
import { SharedModule } from '@/shared/infrastructure/shared.module';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				BcryptPasswordCipher,
				JwtAccessTokenCipher,
				JwtRefreshTokenCipher,
			],
			imports: [DatabaseModule, ConfigModule, JwtModule, SharedModule],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
