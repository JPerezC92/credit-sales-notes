import { TableNames } from '@/db/utils/tableNames';

import { db, queryClient } from './db';

async function drop() {
	const tableSchema = db._.schema;

	if (!tableSchema) {
		throw new Error('No table schema found');
	}

	const queries = [
		'DROP TABLE IF EXISTS __drizzle_migrations;',
		`DROP TABLE IF EXISTS ${TableNames.UserAttributeToRole};`,
		`DROP TABLE IF EXISTS ${TableNames.UserAttributeToAction};`,
		`DROP TABLE IF EXISTS ${TableNames.Action};`,
		`DROP TABLE IF EXISTS ${TableNames.Role};`,
		`DROP TABLE IF EXISTS ${TableNames.AuthUser};`,
		`DROP TABLE IF EXISTS ${TableNames.User};`,
	];

	console.log('🗑️ Emptying the entire database');

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
