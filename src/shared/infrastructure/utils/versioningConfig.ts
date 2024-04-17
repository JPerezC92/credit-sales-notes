import type { VersioningOptions } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';

export const versioningConfig: VersioningOptions = {
	type: VersioningType.URI,
	prefix: 'api/v',
	defaultVersion: '1',
};
