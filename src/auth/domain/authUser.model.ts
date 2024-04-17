import * as crypto from 'node:crypto';

import type { Properties } from '@/shared/domain/types';

import type { PasswordCipher } from './password.cipher';

export type AuthUserProps = Properties<AuthUser>;
export type AuthUserNewProps = Omit<AuthUserProps, 'token' | 'authUserId'>;

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
		this.email = props.email;
	}

	static async new(
		props: AuthUserNewProps,
		passwordCipher: PasswordCipher,
	): Promise<AuthUser> {
		return new AuthUser({
			...props,
			authUserId: crypto.randomUUID(),
			token: new Map(),
			password: await passwordCipher.encrypt(props.password),
		});
	}

	addToken(ip: string, tokenId: string): AuthUser {
		return new AuthUser({
			...this,
			token: new Map(this.token).set(ip, tokenId),
		});
	}

	removeToken(ip: string): AuthUser {
		const token = new Map(this.token);
		token.delete(ip);

		return new AuthUser({
			...this,
			token,
		});
	}

	static isInstance(obj: unknown): obj is AuthUser {
		return obj instanceof AuthUser;
	}
}
