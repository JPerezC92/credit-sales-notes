import type { ActionType } from '@/auth/domain/userAttribute.model';

export interface Role {
	roleId: string;
	name: string;
	action: ActionType[];
	grantAccess: (...permissions: string[]) => void;
}

export interface RoleFactory {
	create: (name: string) => Role;
}
