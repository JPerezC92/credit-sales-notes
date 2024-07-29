import * as crypto from 'node:crypto';

export interface UserProps {
	userId: string;
	firstNameOne: string;
	firstNameTwo: string;
	lastNameOne: string;
	lastNameTwo: string;
	email: string;
	createdAt: Date;
	modifiedAt: Date;
	roles: string[];
	actions: string[];
}

export type UserNewProps = Pick<
	UserProps,
	'firstNameOne' | 'firstNameTwo' | 'lastNameOne' | 'lastNameTwo' | 'email'
>;

export class User {
	public readonly userId: string;
	public readonly firstNameOne: string;
	public readonly firstNameTwo: string;
	public readonly lastNameOne: string;
	public readonly lastNameTwo: string;
	public readonly email: string;
	public readonly createdAt: Date;
	public readonly modifiedAt: Date;
	public readonly roles: string[];
	public readonly actions: string[];

	constructor(props: UserProps) {
		this.userId = props.userId;
		this.firstNameOne = props.firstNameOne;
		this.firstNameTwo = props.firstNameTwo;
		this.lastNameOne = props.lastNameOne;
		this.lastNameTwo = props.lastNameTwo;
		this.email = props.email;
		this.roles = props.roles;
		this.actions = props.actions;
		this.createdAt = props.createdAt;
		this.modifiedAt = props.modifiedAt;
	}

	static new(props: UserNewProps): User {
		return new User({
			...props,
			userId: crypto.randomUUID(),
			createdAt: new Date(),
			modifiedAt: new Date(),
			roles: [],
			actions: [],
		});
	}

	static isInstance(obj: unknown): obj is User {
		return obj instanceof User;
	}
}
