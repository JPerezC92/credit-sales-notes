import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import IP from 'ip';

import * as authSchemas from '@/auth/infrastructure/schemas';
import { AuthService } from '@/auth/infrastructure/services/auth.service';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import * as sharedSchemas from '@/shared/infrastructure/schemas';

@Controller('auth')
@ApiTags('auth')
@UsePipes(ZodValidationPipe)
@ApiInternalServerErrorResponse({
	type: sharedSchemas.InternalServerError,
})
export class AuthController {
	constructor(
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
		private readonly authService: AuthService,
	) {}

	@Post()
	@ApiOkResponse({ type: authSchemas.AuthentiocationTokensDto })
	@ApiUnprocessableEntityResponse({ type: sharedSchemas.UnprocessableEntity })
	@ApiBadRequestResponse({
		type: sharedSchemas.BadRequest,
	})
	async login(@Body() createAuthDto: authSchemas.CredentialsDto) {
		const ip = IP.address();

		return await this.authService.login(createAuthDto, ip);
	}
}
