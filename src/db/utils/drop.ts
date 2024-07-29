import { TableNames } from '@/db/utils/tableNames';

import { db, queryClient } from './db';

async function drop() {
	const tableSchema = db._.schema;

	if (!tableSchema) {
		throw new Error('No table schema found');
	}

	let queries = ['DROP TABLE IF EXISTS __drizzle_migrations;'];

	console.log('🗑️ Emptying the entire database');

	queries = [
		...queries,
		...Object.values(TableNames).map(table => {
			console.log(`🧨 Preparing delete query for table: ${table}`);
			return `DROP TABLE IF EXISTS ${table};`;
		}),
	];

	console.log('🛜 Sending delete queries');

	await queryClient.batch(queries);
}

drop()
	.then(() => {
		console.log('✅ Database emptied');
		// process.exit(0);
	})
	.catch(e => {
		console.log('❌ Database not emptied');
		console.error(e);
		// process.exit(1);
	});
