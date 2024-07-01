import type { BearerToken, TypelessToken } from '@/auth/domain/token.model';

export interface AuthTokenPros {
	accessToken: BearerToken;
	refreshToken: TypelessToken;
}

export class Authorization {
	readonly accessToken: BearerToken;
	readonly refreshToken: TypelessToken;

	constructor(props: AuthTokenPros) {
		this.accessToken = props.accessToken;
		this.refreshToken = props.refreshToken;
	}

	static isInstance(object: unknown): object is Authorization {
		return object instanceof Authorization;
	}
}
