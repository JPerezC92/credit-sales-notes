export interface AuthTokenPros {
	accessToken: string;
	refreshToken: string;
}

export class AuthToken {
	readonly accessToken: string;
	readonly refreshToken: string;

	constructor(props: AuthTokenPros) {
		this.accessToken = props.accessToken;
		this.refreshToken = props.refreshToken;
	}

	static isInstance(object: unknown): object is AuthToken {
		return object instanceof AuthToken;
	}
}
