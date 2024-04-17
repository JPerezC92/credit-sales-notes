import { usersSeeder } from '@/db/seeders';
import { db } from '@/db/utils/db';

async function seed() {
	const tableSchema = db._.schema;

	if (!tableSchema) {
		throw new Error('No table schema found');
	}

	await usersSeeder();

	console.log('✅ Database seeded');
}

seed()
	.then(() => {
		process.exit(0);
	})
	.catch(() => {
		process.exit(1);
	});
