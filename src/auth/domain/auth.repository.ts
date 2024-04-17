import type { AuthUser } from './authUser.model';

export interface AuthRepository {
	findUserByEmail: (email: string) => Promise<AuthUser | null>;
	saveAuthUser: (user: AuthUser) => Promise<void>;
	updateAuthUser: (user: AuthUser) => Promise<void>;
}
