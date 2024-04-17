import * as crypto from 'node:crypto';

import type { PasswordCipher } from './password.cipher';

interface AuthUserProps {
	authUserId: string;
	email: string;
	token: Map<string, string>;
	password: string;
	userId: string;
}

export class AuthUser {
	public readonly authUserId: string;
	public readonly email: string;
	public readonly token: Map<string, string>;
	public readonly password: string;
	public readonly userId: string;

	constructor(props: AuthUserProps) {
		this.token = props.token;
		this.authUserId = props.authUserId;
		this.userId = props.userId;
		this.password = props.password;
	}

	static async new(
		props: Omit<AuthUserProps, 'token' | 'authUserId'>,
		passwordCipher: PasswordCipher,
	): Promise<AuthUser> {
		return new AuthUser({
			...props,
			authUserId: crypto.randomUUID(),
			token: new Map(),
			password: await passwordCipher.encrypt(props.password),
		});
	}

	addToken(ip: string, tokenId: string): void {
		this.token.set(ip, tokenId);
	}

	removeToken(ip: string): void {
		this.token.delete(ip);
	}
}
