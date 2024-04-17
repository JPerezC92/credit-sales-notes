import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/infrastructure/auth.module';
import { DatabaseModule } from '@/db/database.module';
import { UsersModule } from '@/users/infrastructure/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [AuthModule, UsersModule, DatabaseModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
