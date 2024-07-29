export enum TokenType {
	Bearer = 'Bearer',
	Typeless = 'Typeless',
}

export interface Token {
	value: string;
	type: TokenType;
}

export class BearerToken implements Token {
	readonly type = TokenType.Bearer;
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}
}

export class TypelessToken implements Token {
	readonly type = TokenType.Typeless;
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}
}
