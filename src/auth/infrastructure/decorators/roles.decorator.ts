import { SetMetadata } from '@nestjs/common';

import { MetadataKeys } from '@/shared/infrastructure/utils';
import type { RoleType } from '@/src/roles/domain';

export const Roles = (...roles: RoleType[]) =>
	SetMetadata(MetadataKeys.ROLES, roles);
