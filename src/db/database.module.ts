import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DrizzleService } from '@/db/services';

@Module({
	controllers: [],
	providers: [DrizzleService],
	exports: [DrizzleService],
	imports: [ConfigModule],
})
export class DatabaseModule {}
