import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const typelessTokenSchema = z.object({
	value: z.string().trim(),
});

const bearerTokenSchema = z.object({
	type: z.literal('Bearer'),
	value: z.string().trim(),
});

export const AuthorizationSchema = extendApi(
	z.object({
		accessToken: bearerTokenSchema,
		refreshToken: typelessTokenSchema,
	}),
	{
		title: 'AuthentiocationTokens',
		description: 'Authentiocation tokens for a user session.',
	},
);

export class AuthorizationDto extends createZodDto(AuthorizationSchema) {}
