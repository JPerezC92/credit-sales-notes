import { HttpStatus } from '@nestjs/common';
import { ReasonPhrases } from 'http-status-codes';

export const badRequestErrorExpected = {
	statusCode: HttpStatus.BAD_REQUEST,
	message: expect.any(Array),
	error: ReasonPhrases.BAD_REQUEST,
};
