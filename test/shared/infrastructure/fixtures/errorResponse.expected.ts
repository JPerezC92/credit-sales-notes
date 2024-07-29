import type { ErrorResponse } from '@/shared/infrastructure/schemas';

export const ErrorResponseExpected = {
	create(params?: Partial<ErrorResponse>): ErrorResponse {
		return {
			createdAt: expect.any(String),
			error: expect.any(String),
			message: expect.any(String),
			path: expect.any(String),
			statusCode: expect.any(Number),
			...params,
		};
	},
};
