import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import type { AuthUser, RoleType } from '@/auth/domain';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { ErrorResponse } from '@/shared/infrastructure/schemas';
import { PrdRolesRepository } from '@/src/roles/domain';

interface RequestData {
	user?: AuthUser;
	url: string;
}

export enum MetadataKeys {
	ROLES = 'roles',
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const rolesAllowed = this.reflector.get<RoleType[]>(
			MetadataKeys.ROLES,
			context.getHandler(),
		);
		const request = context.switchToHttp().getRequest<RequestData>();

		const authUser = request.user;

		if (!authUser || !rolesAllowed) return false;

		const roles = await this.db.transaction(
			async tx =>
				await new PrdRolesRepository(tx).findRolesByUserId(
					authUser.userId,
				),
		);

		const hasRole = rolesAllowed.some(role =>
			roles.some(r => r.isValueOf(role)),
		);

		if (!hasRole) {
			throw new ForbiddenException({
				error: ReasonPhrases.FORBIDDEN,
				message: 'The user is not authorized to access the resource.',
				statusCode: StatusCodes.FORBIDDEN,
				createdAt: new Date().toISOString(),
				path: request?.url ?? '',
			} satisfies ErrorResponse);
		}

		return hasRole;
	}
}
