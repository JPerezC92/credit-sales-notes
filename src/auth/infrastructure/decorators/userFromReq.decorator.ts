import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { User } from '@/users/domain';

export const UserFromReq = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): User => {
		const request = ctx.switchToHttp().getRequest<Request>();

		if (!User.isInstance(request.user)) throw new BadRequestException();

		return request.user;
	},
);
