import { z } from 'zod';

export const timestampSchema = z.object({
	createdAt: z.date(),
	modifiedAt: z.date(),
});
