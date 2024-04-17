import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import {
	AccessJwtStrategy,
	AuthService,
	BcryptPasswordCipher,
	JwtAccessTokenCipher,
	JwtRefreshTokenCipher,
	RefreshJwtStrategy,
} from '@/auth/infrastructure/services';
import { DatabaseModule } from '@/db/database.module';
import { SharedModule } from '@/shared/infrastructure/shared.module';

import { AuthController } from './auth.controller';

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		BcryptPasswordCipher,
		JwtAccessTokenCipher,
		JwtRefreshTokenCipher,
		AccessJwtStrategy,
		RefreshJwtStrategy,
	],
	imports: [DatabaseModule, ConfigModule, JwtModule, SharedModule],
	exports: [BcryptPasswordCipher],
})
export class AuthModule {}
