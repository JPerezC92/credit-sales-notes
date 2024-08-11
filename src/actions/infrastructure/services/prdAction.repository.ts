import { eq } from 'drizzle-orm';

import * as dbSchemas from '@/db/schemas';
import { TX } from '@/db/services';
import { RepositoryError } from '@/shared/domain';
import type { Action, ActionRepository } from '@/src/actions/domain';
import { actionDbToDomainAdapter } from '@/src/actions/infrastructure/adapters';
import type { User } from '@/users/domain';

export class PrdActionsRepository implements ActionRepository {
	constructor(private readonly tx: TX) {}

	async findActionsByUserId(userId: User['userId']): Promise<Action[]> {
		try {
			const result = await this.tx
				.select({
					actionId: dbSchemas.actionDb.actionId,
					name: dbSchemas.actionDb.name,
					userId: dbSchemas.userDbToActionDb.userId,
				})
				.from(dbSchemas.userDbToActionDb)
				.innerJoin(
					dbSchemas.actionDb,
					eq(
						dbSchemas.actionDb.actionId,
						dbSchemas.userDbToActionDb.actionId,
					),
				)
				.where(eq(dbSchemas.userDbToActionDb.userId, userId));

			return result.map(actionDbToDomainAdapter);
		} catch (error) {
			throw new RepositoryError(error);
		}
	}
}
