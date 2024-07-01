import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from './errorResponse.schema';

export const badRequest = createErrorResponseSchema({
	title: 'BadRequestResponse',
	description:
		'This response is returned when the request is malformed or invalid.',
	example: {
		statusCode: StatusCodes.BAD_REQUEST,
		message: 'The request is malformed or invalid.',
		error: ReasonPhrases.BAD_REQUEST,
		path: 'Endpoint path',
		createdAt: 'Date',
	},
});

export class BadRequest extends createZodDto(badRequest) {}
