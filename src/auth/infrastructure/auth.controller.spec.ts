import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import {
	BcryptPasswordCipher,
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { DatabaseModule } from '@/db/database.module';
import { SharedModule } from '@/shared/infrastructure/shared.module';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				AuthService,
				BcryptPasswordCipher,
				JwtAccessTokenCipher,
				JwtRefreshTokenCipher,
			],
			imports: [DatabaseModule, ConfigModule, JwtModule, SharedModule],
			exports: [BcryptPasswordCipher],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
