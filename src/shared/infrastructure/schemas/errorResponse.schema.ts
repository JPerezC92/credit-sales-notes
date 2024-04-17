import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const errorResponseSchema = extendApi(
	z.object({
		statusCode: z.number().describe('number'),
		message: z.string(),
		code: z.string(),
	}),
	{
		title: 'ErrorResponse',
		description: 'Error response',
		example: {
			statusCode: 'number',
			message: 'string',
			code: 'string',
		},
	},
);

export class ErrorResponse extends createZodDto(errorResponseSchema) {}

export function dynamicErrorResponseSchema(code: number) {
	const errorResponseSchema = extendApi(
		z.object({
			statusCode: z.number().describe('number'),
			message: z.string(),
			code: z.string(),
		}),
		{
			title: 'ErrorResponse',
			description: 'Error response',
			example: {
				statusCode: code,
				message: 'string',
				code: 'string',
			},
		},
	);

	return class extends createZodDto(errorResponseSchema) {};
}
