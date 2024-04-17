/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '../',
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},

	preset: 'ts-jest',
	modulePaths: [compilerOptions.baseUrl],
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
