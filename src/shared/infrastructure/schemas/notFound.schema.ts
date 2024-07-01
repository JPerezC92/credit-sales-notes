import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from './errorResponse.schema';

export const notFound = createErrorResponseSchema({
	title: 'NotFoundResponse',
	description: 'Indicates that the requested resource was not found.',
	example: {
		statusCode: StatusCodes.NOT_FOUND,
		message: 'The requested resource was not found.',
		error: ReasonPhrases.NOT_FOUND,
		path: 'Endpoint path',
		createdAt: 'Date',
	},
});

export class NotFound extends createZodDto(notFound) {}
