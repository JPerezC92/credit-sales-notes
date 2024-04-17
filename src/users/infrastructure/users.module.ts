import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/infrastructure/auth.module';
import { DatabaseModule } from '@/db/database.module';
import { SharedModule } from '@/shared/infrastructure/shared.module';
import { UsersService } from '@/users/infrastructure/services';

import { UsersController } from './users.controller';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [DatabaseModule, AuthModule, SharedModule],
})
export class UsersModule {}
