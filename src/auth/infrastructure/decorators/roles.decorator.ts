import { SetMetadata } from '@nestjs/common';

export enum RolesEnum {
	ADMIN = 'admin',
}

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
