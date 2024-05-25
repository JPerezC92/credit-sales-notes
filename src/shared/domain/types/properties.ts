export type Properties<T extends object> = {
	[P in keyof T as T[P] extends (...args: unknown[]) => unknown
		? never
		: P]: T[P];
};
