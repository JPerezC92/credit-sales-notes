import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const credentials = extendApi(
	z
		.object({
			email: z.string().email().min(1).max(150).trim(),
			password: z.string().min(1).max(50).trim(),
		})
		.strict(),
);

export class CredentialsDto extends createZodDto(credentials) {}
