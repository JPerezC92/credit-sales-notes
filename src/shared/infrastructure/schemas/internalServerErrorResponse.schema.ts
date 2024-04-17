import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from './errorResponse.schema';

const internalServerErrorSchema = createErrorResponseSchema({
	title: 'InternalServerErrorResponse',
	description:
		'Represents a response when an unexpected error occurs on the server.',
	example: {
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
		message: 'An unexpected error occurred on the server.',
		error: ReasonPhrases.INTERNAL_SERVER_ERROR,
		path: 'Endpoint path',
		createAt: 'Date',
	},
});

export class InternalServerError extends createZodDto(
	internalServerErrorSchema,
) {}
