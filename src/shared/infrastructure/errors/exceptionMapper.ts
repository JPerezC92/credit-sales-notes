import type {
	HttpException as NestHttpException,
	HttpExceptionOptions,
} from '@nestjs/common';
import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { DomainError } from '@/shared/domain';
import type { ErrorResponse } from '@/shared/infrastructure/schemas';

type HttpException = new (
	objectOrError?: string | object | any,
	descriptionOrOptions?: string | HttpExceptionOptions,
) => NestHttpException;

@Injectable()
export class ExceptionMapper {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	mapDomainErrorToHttpException<
		const TError extends DomainError,
		const TConfig extends {
			[key in `${TError['code']}`]: HttpException;
		},
	>(error: TError, config: TConfig): () => NestHttpException {
		if (!DomainError.isInstance(error)) {
			return () =>
				new InternalServerErrorException({
					error: ReasonPhrases.INTERNAL_SERVER_ERROR,
					message: 'An unexpected error occurred',
					statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
					path: this.request.url,
					createAt: new Date().toISOString(),
				} satisfies ErrorResponse);
		}

		const Exception = config[error.code] as HttpException | undefined;

		if (!Exception)
			throw new Error("DomainError doesn't have a mapped HttpException");

		return () =>
			new Exception({
				error: error.code,
				message: error.message,
				statusCode: new Exception().getStatus(),
				path: this.request.url,
				createAt: new Date().toISOString(),
			} satisfies ErrorResponse);
	}
}
