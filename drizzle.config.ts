import type { Config } from 'drizzle-kit';

import { envVariables, isProduction } from '@/shared/infrastructure/utils';

export default {
	schema: 'src/db/schemas/*',
	out: 'drizzle',
	driver: isProduction() ? 'turso' : 'libsql', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		url: `./${envVariables.DATABASE_NAME}.sqlite`,
	},
	// tablesFilter: [`${projectPrefix}*`], // Only tables with this prefix will be generated
	verbose: true,
	strict: true,
} satisfies Config;
