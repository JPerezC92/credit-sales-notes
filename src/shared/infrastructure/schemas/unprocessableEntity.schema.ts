import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { HttpStatus } from '@nestjs/common';

import { errorResponseSchema } from './errorResponse.schema';

export const unprocessableEntity = extendApi<typeof errorResponseSchema>(
	errorResponseSchema,
	{
		title: 'UnprocessableEntityResponse',
		description:
			'When the request is valid but the server cannot process it.',
		example: {
			statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			message: 'Unprocessable Entity',
			code: 'UNPROCESSABLE_ENTITY',
		},
	},
);

export class UnprocessableEntity extends createZodDto(unprocessableEntity) {}
