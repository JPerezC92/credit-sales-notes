import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import type { AuthUser } from '@/auth/domain';
import { DrizzleClient, DrizzleClientToken } from '@/db/services';
import type { ErrorResponse } from '@/shared/infrastructure/schemas';
import { MetadataKeys } from '@/shared/infrastructure/utils';
import type { ActionType } from '@/src/actions/domain';
import { PrdActionsRepository } from '@/src/actions/infrastructure/services';

interface RequestData {
	user?: AuthUser;
	url: string;
}

@Injectable()
export class ActionsGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@Inject(DrizzleClientToken) private readonly db: DrizzleClient,
	) {}

	async canActivate(context: ExecutionContext) {
		const actionsAllowed = this.reflector.get<ActionType[]>(
			MetadataKeys.ACTIONS,
			context.getHandler(),
		);

		const request = context.switchToHttp().getRequest<RequestData>();

		const authUser = request.user;

		if (!authUser || !actionsAllowed) return false;

		const actions = await this.db.transaction(
			async tx =>
				await new PrdActionsRepository(tx).findActionsByUserId(
					authUser.userId,
				),
		);

		const hasAction = actionsAllowed.some(actionType =>
			actions.some(r => r.isValueOf(actionType)),
		);

		if (!hasAction) {
			throw new ForbiddenException({
				error: ReasonPhrases.FORBIDDEN,
				message:
					'The user execution action is not authorized to access the resource.',
				statusCode: StatusCodes.FORBIDDEN,
				createdAt: new Date().toISOString(),
				path: request?.url ?? '',
			} satisfies ErrorResponse);
		}

		return hasAction;
	}
}
