import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/infrastructure/auth.module';
import { DatabaseModule } from '@/db/database.module';
import { UsersService } from '@/users/infrastructure/services';

import { UsersController } from './users.controller';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [DatabaseModule, AuthModule],
})
export class UsersModule {}
