import type { RoleDb } from '@/db/schemas';
import { Role } from '@/src/roles/domain';

export function roleDbToDomainAdapter(role: RoleDb): Role {
	return new Role({
		roleId: role.roleId,
		name: role.name,
	});
}
