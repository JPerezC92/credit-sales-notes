import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import {
	AccessTokenCipher,
	AuthService,
	BcryptPasswordCipher,
	RefreshTokenCipher,
} from '@/auth/infrastructure/services';
import { DatabaseModule } from '@/db/database.module';

import { AuthController } from './auth.controller';

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		BcryptPasswordCipher,
		AccessTokenCipher,
		RefreshTokenCipher,
	],
	imports: [DatabaseModule, ConfigModule, JwtModule],
	exports: [BcryptPasswordCipher],
})
export class AuthModule {}
