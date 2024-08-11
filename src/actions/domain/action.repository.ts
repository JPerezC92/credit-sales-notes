import type { User } from '@/users/domain';

import type { Action } from './action.model';

export interface ActionRepository {
	findActionsByUserId: (userId: User['userId']) => Promise<Action[]>;
}
