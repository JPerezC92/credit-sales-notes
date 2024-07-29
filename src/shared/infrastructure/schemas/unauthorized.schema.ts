import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from './errorResponse.schema';

export const unauthorized = createErrorResponseSchema({
	title: 'UnauthorizedResponse',
	description:
		'This response is returned when the user is not authenticated or does not have the necessary permissions to access the requested resource.',
	example: {
		statusCode: StatusCodes.UNAUTHORIZED,
		message:
			'The user is not authenticated or does not have the necessary permissions to access the requested resource.',
		error: ReasonPhrases.UNAUTHORIZED,
		path: 'Endpoint path',
		createdAt: 'Date',
	},
});

export class Unauthorized extends createZodDto(unauthorized) {}
