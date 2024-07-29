import { createZodDto } from '@anatine/zod-nestjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createErrorResponseSchema } from './errorResponse.schema';

export const unprocessableEntity = createErrorResponseSchema({
	title: 'UnprocessableEntityResponse',
	description:
		'The server cannot process the request due to semantic errors.',
	example: {
		statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
		message:
			'The server cannot process the request due to semantic errors.',
		error: ReasonPhrases.UNPROCESSABLE_ENTITY,
		path: 'Endpoint path',
		createdAt: 'Date',
	},
});

export class UnprocessableEntity extends createZodDto(unprocessableEntity) {}
