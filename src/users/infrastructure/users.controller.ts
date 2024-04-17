import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UseFilters, UsePipes } from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
} from '@nestjs/swagger';

import { RepositoryExceptionFilter } from '@/shared/infrastructure/filters';
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
	@UseFilters(RepositoryExceptionFilter)
	async register(@Body() userCreateDto: userSchemas.UserCreateDto) {
		return await this.usersService.create(userCreateDto);
	}
}
