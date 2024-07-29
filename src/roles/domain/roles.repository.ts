import { and, eq } from 'drizzle-orm';

import * as dbSchemas from '@/db/schemas';
import { TX } from '@/db/services';
import { RepositoryError } from '@/shared/domain';
import type { Role } from '@/src/roles/domain/role.model';
import { roleDbToDomainAdapter } from '@/src/roles/infrastructure/adapters';

export interface RolesRepository {
	findRolesByUserId: (userId: string) => Promise<Role[]>;
}

export class PrdRolesRepository implements RolesRepository {
	constructor(private readonly tx: TX) {}

	async findRolesByUserId(userId: string): Promise<Role[]> {
		try {
			const result = await this.tx
				.select({
					roleId: dbSchemas.roleDb.roleId,
					name: dbSchemas.roleDb.name,
					userId: dbSchemas.userDbToRoleDb.userId,
				})
				.from(dbSchemas.userDbToRoleDb)
				.innerJoin(
					dbSchemas.roleDb,
					eq(
						dbSchemas.roleDb.roleId,
						dbSchemas.userDbToRoleDb.roleId,
					),
				)
				.where(
					and(
						eq(dbSchemas.userDbToRoleDb.userId, userId),
						// inArray(dbSchemas.roleDb.name, roles),
					),
				);

			return result.map(roleDbToDomainAdapter);
		} catch (error) {
			throw new RepositoryError(error);
		}
	}
}
