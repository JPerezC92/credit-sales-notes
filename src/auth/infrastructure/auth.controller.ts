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

import { AuthUser } from '@/auth/domain';
import { UserFromReq } from '@/auth/infrastructure/decorators';
import {
	AccessJwtAuthGuard,
	RefreshJwtAuthGuard,
} from '@/auth/infrastructure/guards';
import * as authSchemas from '@/auth/infrastructure/schemas';
import { AuthService } from '@/auth/infrastructure/services';
import { RepositoryExceptionFilter } from '@/shared/infrastructure/filters';
import * as sharedSchemas from '@/shared/infrastructure/schemas';
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
	// #region
	@ApiOkResponse({ type: authSchemas.AuthTokenDto })
	@ApiUnauthorizedResponse({ type: sharedSchemas.Unauthorized })
	@ApiBadRequestResponse({
		type: sharedSchemas.BadRequest,
	})
	// #endregion
	async login(
		@Body() createAuthDto: authSchemas.CredentialsDto,
	): Promise<authSchemas.AuthTokenDto> {
		const ip = IP.address();

		return await this.authService.login(createAuthDto, ip);
	}

	@Get('me')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AccessJwtAuthGuard)
	// #region
	@ApiBearerAuth()
	@ApiOkResponse({ type: userSchemas.UserEndpointDto })
	@ApiUnauthorizedResponse({
		type: sharedSchemas.Unauthorized,
	})
	@ApiNotFoundResponse({
		type: sharedSchemas.NotFound,
	})
	// #endregion
	async me(
		@UserFromReq() user: AuthUser,
	): Promise<userSchemas.UserEndpointDto> {
		return await this.authService.me(user);
	}

	@Get('refresh-token')
	@UseGuards(RefreshJwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	// #region
	@ApiHeader({ name: 'x-refresh-token' })
	@ApiOkResponse({ type: authSchemas.AuthTokenDto })
	@ApiInternalServerErrorResponse({
		type: sharedSchemas.InternalServerError,
	})
	@ApiUnauthorizedResponse({
		type: sharedSchemas.Unauthorized,
	})
	@ApiNotFoundResponse({
		type: sharedSchemas.NotFound,
	})
	// #endregion
	async refreshToken(
		@UserFromReq() authUser: AuthUser,
	): Promise<authSchemas.AuthTokenDto> {
		return await this.authService.refreshToken(authUser, IP.address());
	}

	@Delete('logout')
	@UseGuards(AccessJwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	// #region
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
	// #endregion
	async logout(@UserFromReq() user: AuthUser): Promise<void> {
		await this.authService.logout(user, IP.address());
	}
}
