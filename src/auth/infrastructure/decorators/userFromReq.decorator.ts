import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { AuthUser } from '@/auth/domain';

export const UserFromReq = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): AuthUser => {
		const request = ctx.switchToHttp().getRequest<Request>();

		if (!AuthUser.isInstance(request.user)) throw new BadRequestException();

		return request.user;
	},
);
