import { SetMetadata } from '@nestjs/common';

import type { RoleType } from '@/auth/domain';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
