import type { RoleType } from '@/auth/domain';

export interface RoleProps {
	roleId: string;
	name: RoleType;
}

export class Role {
	readonly roleId: string;
	readonly name: RoleType;

	constructor(props: RoleProps) {
		this.roleId = props.roleId;
		this.name = props.name;
	}

	isValueOf(role: Role['name']): boolean {
		return this.name === role;
	}

	static isInstance(obj: unknown): obj is Role {
		return obj instanceof Role;
	}
}
