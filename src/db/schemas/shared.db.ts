import { integer, text } from 'drizzle-orm/sqlite-core';

export const personDb = {
	firstNameOne: text('firstNameOne', { length: 50 }).notNull(),
	firstNameTwo: text('firstNameTwo', { length: 50 }),
	lastNameOne: text('lastNameOne', { length: 50 }).notNull(),
	lastNameTwo: text('lastNameTwo', { length: 50 }),
};

export const timestampDb = {
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	modifiedAt: integer('modifiedAt', { mode: 'timestamp' }).notNull(),
};
