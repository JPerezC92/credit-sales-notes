import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import { errorResponseSchema } from './errorResponse.schema';

const internalServerErrorSchema = extendApi<typeof errorResponseSchema>(
	errorResponseSchema,
	{
		title: 'InternalServerErrorResponse',
		description: 'When an unexpected error occurs.',
		example: {
			statusCode: 500,
			message: 'Internal server error',
			code: 'INTERNAL_SERVER_ERROR',
		},
	},
);

export class InternalServerError extends createZodDto(
	internalServerErrorSchema,
) {}
