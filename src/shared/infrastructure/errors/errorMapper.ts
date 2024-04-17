import type { HttpException as NestHttpException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

import { DomainError } from '@/shared/domain/domain.error';

type HttpException = new (
	objectOrError?: any,
	description?: string | undefined,
) => NestHttpException;

export type ExceptionList = Array<[DomainError['name'], HttpException]>;

export function mapExceptionToHttpError(exceptionList: ExceptionList) {
	return {
		find: (e: unknown) => {
			const exceptionMap = new Map(exceptionList);

			if (!DomainError.isInstance(e)) {
				return () =>
					new InternalServerErrorException({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'An unexpected error occurred',
						statusCode: 500,
					});
			}

			const Exception = exceptionMap.get(e.name);

			if (!Exception)
				throw new Error(
					"DomainError doesn't have a mapped HttpException",
				);

			return () =>
				new Exception({
					code: e.code,
					message: e.message,
					statusCode: new Exception().getStatus(),
				});
		},
	};
}
