import type { Client } from '@libsql/client';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '@/db/schemas';
import {
	envVariables,
	isDevelopment,
	isTesting,
} from '@/shared/infrastructure/utils';

export let queryClient: Client;

if (isDevelopment() || isTesting()) {
	queryClient = createClient({
		url: `file:./${envVariables.DATABASE_NAME}.sqlite3`,
	});
} else {
	throw new Error('Unknown environment');
}

export const db = drizzle(queryClient, { schema });
// export const db = drizzle(queryClient);
