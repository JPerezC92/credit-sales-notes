import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { User } from '@/users/domain';

interface RequestData {
	user?: User;
}

export enum MetadataKeys {
	ROLES = 'roles',
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get(
			MetadataKeys.ROLES,
			context.getHandler(),
		);

		if (!roles) {
			return true;
		}

		const request = context.switchToHttp().getRequest<RequestData>();
		const user = request.user;
		console.log(user);
		console.log(roles);
		// return matchRoles(roles, user.roles);
		return true;
	}
}
