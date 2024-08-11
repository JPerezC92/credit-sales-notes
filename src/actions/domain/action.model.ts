export enum ActionType {
	VIEW = 'VIEW',
	EDIT = 'EDIT',
	DELETE = 'DELETE',
	WRITE = 'WRITE',
}

export interface ActionProps {
	actionId: string;
	name: ActionType;
}

export class Action {
	readonly actionId: string;
	readonly name: ActionType;

	constructor(props: ActionProps) {
		this.actionId = props.actionId;
		this.name = props.name;
	}

	isValueOf(actionName: Action['name']): boolean {
		return this.name === actionName;
	}

	static isInstance(obj: unknown): obj is Action {
		return obj instanceof Action;
	}
}
