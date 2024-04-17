import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const UserCreate = extendApi(
	z.object({
		firstNameOne: z.string().min(1).max(50).trim(),
		firstNameTwo: z.string().max(50).trim().default(''),
		lastNameOne: z.string().min(1).max(50),
		lastNameTwo: z.string().max(50).trim().default(''),
		email: z.string().email().min(1).max(150).trim(),
		password: z.string().min(1).max(50).trim(),
	}),
	{
		title: 'UserCreate',
		description: 'A new user',
	},
);

export class UserCreateDto extends createZodDto(UserCreate) {}
