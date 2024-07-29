import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import { RepositoryError } from '@/shared/domain';
import type { ErrorResponse } from '@/shared/infrastructure/schemas';
import { isDevelopment } from '@/shared/infrastructure/utils';

@Catch(RepositoryError)
export class RepositoryExceptionFilter implements ExceptionFilter {
	catch(exception: RepositoryError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = HttpStatus.INTERNAL_SERVER_ERROR;

		const body: ErrorResponse = {
			error: RepositoryError.code,
			message: exception.message,
			statusCode: status,
			createdAt: new Date().toISOString(),
			path: request.url,
		};

		if (isDevelopment()) {
			console.log('RepositoryExceptionFilter', body);
		}

		response.status(status).json(body);
	}
}
