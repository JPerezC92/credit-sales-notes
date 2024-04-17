import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import {
	AccessTokenCipher,
	AuthService,
	BcryptPasswordCipher,
	RefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { DatabaseModule } from '@/db/database.module';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				BcryptPasswordCipher,
				AccessTokenCipher,
				RefreshTokenCipher,
			],
			imports: [DatabaseModule, ConfigModule, JwtModule],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
