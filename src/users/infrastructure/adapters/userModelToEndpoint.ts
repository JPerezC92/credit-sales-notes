import type { User } from '@/users/domain';
import type { UserEndpointDto } from '@/users/infrastructure/schemas';
import { UserEndpointSchema } from '@/users/infrastructure/schemas';

export function userModelToEndpoint(user: User): UserEndpointDto {
	return UserEndpointSchema.parse(user);
}
