import { Global, Module } from '@nestjs/common';

import { ExceptionMapper } from '@/shared/infrastructure/errors';

@Global()
@Module({
	providers: [ExceptionMapper],
	exports: [ExceptionMapper],
})
export class SharedModule {}
