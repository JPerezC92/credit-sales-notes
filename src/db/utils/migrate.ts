import { migrate } from 'drizzle-orm/libsql/migrator';

import { db, queryClient } from '@/db/utils/db';

// This will run migrations on the database, skipping the ones already applied
migrate(db, { migrationsFolder: './drizzle' })
	.then(() => console.log('Migrations applied successfully'))
	// Don't forget to close the connection, otherwise the script will hang
	.then(async () => queryClient.close())
	.catch(console.error);
