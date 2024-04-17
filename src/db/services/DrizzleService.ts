import type { Client } from '@libsql/client';
import { createClient } from '@libsql/client';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '@/db/schemas';
import {
	envVariables,
	isDevelopment,
	isProduction,
	isTesting,
} from '@/shared/infrastructure/utils';

export const DrizzleClientToken = 'DrizzleService';
export type DrizzleClient = LibSQLDatabase<typeof schema>;
export type TX = Parameters<Parameters<DrizzleClient['transaction']>[0]>[0];

export const DrizzleService: Provider = {
	provide: DrizzleClientToken,
	useFactory: (_configService: ConfigService) => {
		let queryClient: Client;

		if (isDevelopment() || isTesting()) {
			queryClient = createClient({
				url: `file:./${envVariables.DATABASE_NAME}.sqlite3`,
			});
		} else if (isProduction()) {
			queryClient = createClient({
				url: envVariables.TURSO_CONNECTION_URL,
				authToken: envVariables.TURSO_AUTH_TOKEN,
			});
		} else {
			throw new Error('Unknown environment');
		}
		return drizzle(queryClient, { schema });
	},
	inject: [ConfigService],
};
