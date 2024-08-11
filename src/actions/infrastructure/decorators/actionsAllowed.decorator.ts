import { SetMetadata } from '@nestjs/common';

import { MetadataKeys } from '@/shared/infrastructure/utils';
import type { ActionType } from '@/src/actions/domain';

export const ActionsAllowed = (...actions: ActionType[]) =>
	SetMetadata(MetadataKeys.ACTIONS, actions);
