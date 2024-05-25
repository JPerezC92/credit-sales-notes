import { usersSeeder } from '@/db/seeders';
import { db } from '@/db/utils/db';
import { isProduction } from '@/shared/infrastructure/utils';

async function seed() {
	const tableSchema = db._.schema;

	if (!tableSchema) {
		throw new Error('No table schema found');
	}

	if (isProduction()) {
		throw new Error('❌ Cannot seed database in production');
	}

	await Promise.all([usersSeeder()]);

	console.log('✅ Database seeded');
}

seed()
	.then(() => {
		process.exit(0);
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
