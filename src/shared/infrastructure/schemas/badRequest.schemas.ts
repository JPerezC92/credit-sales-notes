import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { HttpStatus } from '@nestjs/common';

import { errorResponseSchema } from './errorResponse.schema';

export const badRequest = extendApi<typeof errorResponseSchema>(
	errorResponseSchema,
	{
		title: 'BadRequestResponse',
		description: 'When the request is malformed or invalid.',
		example: {
			statusCode: HttpStatus.BAD_REQUEST,
			message: 'Bad Request',
			code: 'BAD_REQUEST',
		},
	},
);

export class BadRequest extends createZodDto(badRequest) {}
