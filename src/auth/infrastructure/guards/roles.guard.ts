import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { ErrorResponse } from '@/shared/infrastructure/schemas';
import { MetadataKeys } from '@/shared/infrastructure/utils';
import type { RoleType } from '@/src/roles/domain';
import { PrdRolesRepository } from '@/src/roles/domain';
import type { User } from '@/users/domain';

interface RequestData {
	user?: User;
	url: string;
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

		const user = request.user;

		if (!user || !rolesAllowed) return false;

		const roles = await this.db.transaction(
			async tx =>
				await new PrdRolesRepository(tx).findRolesByUserId(user.userId),
		);

		const hasRole = rolesAllowed.some(roleType =>
			roles.some(r => r.isValueOf(roleType)),
		);

		if (!hasRole) {
			throw new ForbiddenException({
				error: ReasonPhrases.FORBIDDEN,
				message:
					'The user role is not authorized to access the resource.',
				statusCode: StatusCodes.FORBIDDEN,
				createdAt: new Date().toISOString(),
				path: request?.url ?? '',
			} satisfies ErrorResponse);
		}

		return hasRole;
	}
}
