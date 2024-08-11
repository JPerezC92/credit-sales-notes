import type * as dbSchemas from '@/db/schemas';
import { Action } from '@/src/actions/domain';

export function actionDbToDomainAdapter(action: dbSchemas.ActionDb): Action {
	return new Action({
		actionId: action.actionId,
		name: action.name,
	});
}
