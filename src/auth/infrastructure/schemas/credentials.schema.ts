import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const Credentials = extendApi(
	z.object({
		email: z.string().email().min(1).max(150).trim(),
		password: z.string().min(1).max(50).trim(),
	}),
);

export class CredentialsDto extends createZodDto(Credentials) {}
