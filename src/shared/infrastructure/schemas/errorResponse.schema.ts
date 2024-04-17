import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const errorResponseSchema = extendApi(
	z.object({
		statusCode: z.number().describe('number'),
		message: z.string(),
		error: z.string(),
		path: z.string(),
		createAt: z.string(),
	}),
	{
		title: 'ErrorResponse',
		description: 'Error response',
		example: {
			statusCode: 'number',
			message: 'string',
			error: 'string',
			path: 'string',
			createAt: 'string',
		},
	},
);

export type ErrorResponseSchema = typeof errorResponseSchema;
export class ErrorResponse extends createZodDto(errorResponseSchema) {}

type AnatineSchemaObject = Parameters<typeof extendApi>[1] & {
	example: ErrorResponse;
};
export function createErrorResponseSchema(schemaObject?: AnatineSchemaObject) {
	return extendApi(errorResponseSchema, schemaObject);
}
