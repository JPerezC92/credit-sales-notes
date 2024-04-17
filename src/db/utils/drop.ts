import { db, queryClient } from './db';

async function drop() {
	const tableSchema = db._.schema;

	if (!tableSchema) {
		throw new Error('No table schema found');
	}

	let queries = [`DROP TABLE IF EXISTS __drizzle_migrations;`];

	console.log('🗑️ Emptying the entire database');

	queries = [
		...queries,
		...Object.values(tableSchema).map(table => {
			console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
			return `DROP TABLE IF EXISTS ${table.dbName};`;
		}),
	];

	console.log('🛜 Sending delete queries');

	await queryClient.batch(queries);

	console.log('✅ Database emptied');
}

drop()
	.then(() => {
		process.exit(0);
	})
	.catch(() => {
		process.exit(1);
	});
