import * as crypto from 'node:crypto';

import type { PasswordCipher } from '@/auth/domain';

export interface UserProps {
	userId: string;
	firstNameOne: string;
	firstNameTwo: string;
	lastNameOne: string;
	lastNameTwo: string;
	email: string;
	token: Map<string, string>;
	password: string;
	createdAt: Date;
	modifiedAt: Date;
	roles: string[];
	actions: string[];
}

export type UserNewProps = Pick<
	UserProps,
	| 'firstNameOne'
	| 'firstNameTwo'
	| 'lastNameOne'
	| 'lastNameTwo'
	| 'email'
	| 'password'
>;

export class User {
	public readonly userId: string;
	public readonly firstNameOne: string;
	public readonly firstNameTwo: string;
	public readonly lastNameOne: string;
	public readonly lastNameTwo: string;
	public readonly email: string;
	public readonly token: Map<string, string>;
	public readonly password: string;
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
		this.token = props.token;
		this.password = props.password;
		this.roles = props.roles;
		this.actions = props.actions;
		this.createdAt = props.createdAt;
		this.modifiedAt = props.modifiedAt;
	}

	static async new(
		props: UserNewProps,
		passwordCipher: PasswordCipher,
	): Promise<User> {
		return new User({
			...props,
			token: new Map(),
			userId: crypto.randomUUID(),
			password: await passwordCipher.encrypt(props.password),
			createdAt: new Date(),
			modifiedAt: new Date(),
			roles: [],
			actions: [],
		});
	}

	addToken(ip: string, tokenId: string): User {
		return new User({
			...this,
			token: new Map(this.token).set(ip, tokenId),
		});
	}

	removeToken(ip: string): User {
		const token = new Map(this.token);
		token.delete(ip);

		return new User({
			...this,
			token,
		});
	}

	static isInstance(obj: unknown): obj is User {
		return obj instanceof User;
	}
}
