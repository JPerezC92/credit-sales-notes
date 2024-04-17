import type { AuthUser } from './authUser.model';

export interface AuthRepository {
	findUserByEmail: (email: string) => Promise<AuthUser | null>;
	saveUser: (user: AuthUser) => Promise<void>;
	updateUserToken: (user: AuthUser) => Promise<void>;
}
