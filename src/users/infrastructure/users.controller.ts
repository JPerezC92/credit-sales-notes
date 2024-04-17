import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
} from '@nestjs/swagger';

import * as sharedSchemas from '@/shared/infrastructure/schemas';
import * as userSchemas from '@/users/infrastructure/schemas';
import { UsersService } from '@/users/infrastructure/services';

@Controller('users')
@ApiTags('users')
@UsePipes(ZodValidationPipe)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiCreatedResponse({ type: userSchemas.UserEndpointDto })
	@ApiConflictResponse({ type: sharedSchemas.ErrorResponse })
	@ApiInternalServerErrorResponse({
		type: sharedSchemas.InternalServerError,
	})
	async login(@Body() userCreateDto: userSchemas.UserCreateDto) {
		return await this.usersService.create(userCreateDto);
	}
}
