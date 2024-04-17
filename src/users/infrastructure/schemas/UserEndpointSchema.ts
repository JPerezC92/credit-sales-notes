import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

import * as sharedSchemas from '@/shared/infrastructure/schemas';

import { UserCreate } from './UserCreate';

export const UserEndpointSchema = extendApi(
	z
		.object({
			userId: z.string().uuid(),
			email: z.string().email(),
		})
		.merge(sharedSchemas.timestampSchema)
		.merge(UserCreate.omit({ password: true })),
	{
		title: 'User',
		description: 'A new user',
	},
);

export class UserEndpointDto extends createZodDto(UserEndpointSchema) {}
