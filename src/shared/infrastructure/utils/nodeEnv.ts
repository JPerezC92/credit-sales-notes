export enum NodeEnv {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export function isProduction(): boolean {
	return process.env.NODE_ENV === NodeEnv.Production;
}

export function isDevelopment(): boolean {
	return process.env.NODE_ENV === NodeEnv.Development;
}

export function isTesting(): boolean {
	return process.env.NODE_ENV === NodeEnv.Test;
}
