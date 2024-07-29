import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
	Body,
	Controller,
	Post,
	UseFilters,
	UseGuards,
	UsePipes,
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '@/auth/domain';
import { Roles } from '@/auth/infrastructure/decorators';
import { AccessJwtAuthGuard, RolesGuard } from '@/auth/infrastructure/guards';
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
	@Roles(RoleType.ADMIN)
	@UseGuards(AccessJwtAuthGuard, RolesGuard)
	@ApiCreatedResponse({ type: userSchemas.UserEndpointDto })
	@ApiForbiddenResponse({ type: sharedSchemas.Forbidden })
	@ApiConflictResponse({ type: sharedSchemas.ErrorResponse })
	@ApiInternalServerErrorResponse({
		type: sharedSchemas.InternalServerError,
	})
	@UseFilters(RepositoryExceptionFilter)
	async register(@Body() userCreateDto: userSchemas.UserCreateDto) {
		return await this.usersService.create(userCreateDto);
	}
}
