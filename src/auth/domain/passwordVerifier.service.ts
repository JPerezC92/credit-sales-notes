import type { AuthUser, PasswordCipher } from '@/auth/domain';

import type { Credentials } from './credentials.model';

export async function PasswordVerifierService(
	credentials: Credentials,
	user: AuthUser,
	passwordCipher: PasswordCipher,
): Promise<boolean> {
	const isPasswordCorrect = await passwordCipher.compare(
		credentials.password,
		user.password,
	);

	return isPasswordCorrect;
}
