import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from '@/shared/infrastructure/schemas/errorResponse.schema';

export const forbiddenSchema = createErrorResponseSchema({
	title: 'FordiddenResponse',
	description:
		'Indicates that the user is not authorized to access the resource.',
	example: {
		statusCode: StatusCodes.FORBIDDEN,
		message: 'The user is not authorized to access the resource.',
		error: ReasonPhrases.FORBIDDEN,
		path: 'Endpoint path',
		createdAt: 'Date',
	},
});

export class Forbidden extends createZodDto(forbiddenSchema) {}
