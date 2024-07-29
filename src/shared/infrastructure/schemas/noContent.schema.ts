import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from '@/shared/infrastructure/schemas/errorResponse.schema';

export const noContentSchema = createErrorResponseSchema({
	title: 'NoContentResponse',
	description:
		'Indicates that the request has succeeded but has no content to return.',
	example: {
		statusCode: StatusCodes.NO_CONTENT,
		message: 'The request has succeeded but has no content to return.',
		error: ReasonPhrases.NO_CONTENT,
		path: 'Endpoint path',
		createdAt: 'Date',
	},
});

export class NoContent extends createZodDto(noContentSchema) {}
