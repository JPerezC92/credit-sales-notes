export enum AttributeType {
	rol = 'ROLE',
	action = 'ACTION',
}

export interface UserAttributeProps {
	userAttributeId: string;
	type: AttributeType;
	value: RoleType | ActionType;
}

export abstract class UserAttribute2 {
	abstract userAttributeId: string;
	abstract type: string;
	abstract value: string;
}

export enum RoleType {
	ADMIN = 'ADMIN',
	SELLER = 'SELLER',
}

export interface RoleProps extends UserAttributeProps {
	value: RoleType;
}

export class Role2 implements UserAttribute2 {
	userAttributeId: string;
	type: AttributeType = AttributeType.rol;
	value: RoleType;

	constructor(props: RoleProps) {
		this.userAttributeId = props.userAttributeId;
		this.value = props.value;
	}
}

export enum ActionType {
	EDIT = 'EDIT',
	DELETE = 'DELETE',
	VIEW = 'VIEW',
}

export interface ActionProps extends UserAttributeProps {
	value: ActionType;
}

export class Action implements UserAttribute2 {
	userAttributeId: string;
	type: AttributeType = AttributeType.action;
	value: ActionType;

	constructor(props: ActionProps) {
		this.userAttributeId = props.userAttributeId;
		this.value = props.value;
	}
}
