import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseFilters,
	UseGuards,
	UsePipes,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiHeader,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import IP from 'ip';

import { UserFromReq } from '@/auth/infrastructure/decorators';
import {
	AccessJwtAuthGuard,
	RefreshJwtAuthGuard,
} from '@/auth/infrastructure/guards';
import * as authSchemas from '@/auth/infrastructure/schemas';
import { AuthService } from '@/auth/infrastructure/services';
import { RepositoryExceptionFilter } from '@/shared/infrastructure/filters';
import * as sharedSchemas from '@/shared/infrastructure/schemas';
import { User } from '@/users/domain';
import * as userSchemas from '@/users/infrastructure/schemas';

@Controller('auth')
@ApiTags('auth')
@UsePipes(ZodValidationPipe)
@ApiInternalServerErrorResponse({
	type: sharedSchemas.InternalServerError,
})
@UseFilters(RepositoryExceptionFilter)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: authSchemas.AuthorizationDto })
	@ApiUnauthorizedResponse({ type: sharedSchemas.Unauthorized })
	@ApiBadRequestResponse({
		type: sharedSchemas.BadRequest,
	})
	async login(
		@Body() createAuthDto: authSchemas.CredentialsDto,
	): Promise<authSchemas.AuthorizationDto> {
		const ip = IP.address();

		return await this.authService.login(createAuthDto, ip);
	}

	@Get('me')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AccessJwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ type: userSchemas.UserEndpointDto })
	@ApiUnauthorizedResponse({
		type: sharedSchemas.Unauthorized,
	})
	@ApiNotFoundResponse({
		type: sharedSchemas.NotFound,
	})
	async me(@UserFromReq() user: User): Promise<userSchemas.UserEndpointDto> {
		return await this.authService.me(user.email);
	}

	@Get('refresh-token')
	@UseGuards(RefreshJwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ApiHeader({ name: 'x-refresh-token' })
	@ApiOkResponse({ type: authSchemas.AuthorizationDto })
	@ApiInternalServerErrorResponse({
		type: sharedSchemas.InternalServerError,
	})
	@ApiUnauthorizedResponse({
		type: sharedSchemas.Unauthorized,
	})
	@ApiNotFoundResponse({
		type: sharedSchemas.NotFound,
	})
	async refreshToken(
		@UserFromReq() user: User,
	): Promise<authSchemas.AuthorizationDto> {
		return await this.authService.refreshToken(user.email, IP.address());
	}

	@Delete('logout')
	@UseGuards(AccessJwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse({
		type: sharedSchemas.NoContent,
	})
	@ApiUnauthorizedResponse({
		type: sharedSchemas.Unauthorized,
	})
	@ApiNotFoundResponse({
		type: sharedSchemas.NotFound,
	})
	@ApiBearerAuth()
	async logout(@UserFromReq() user: User): Promise<void> {
		await this.authService.logout(user, IP.address());
	}
}
