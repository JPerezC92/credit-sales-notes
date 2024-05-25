import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const refreshPayload = extendApi(
	z.object({
		tokenId: z.string().uuid(),
		email: z.string().email().min(1).max(150).trim(),
	}),
);
