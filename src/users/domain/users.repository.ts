import type { User } from './user.model';

export interface UsersRepository {
	save: (user: User) => Promise<void>;
	findByEmail: (email: User['email']) => Promise<User | null>;
	update: (user: User) => Promise<void>;
}
