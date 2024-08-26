import type { PasswordCipher } from '@/auth/domain';
import type { User } from '@/users/domain';

import type { Credentials } from './credentials.model';

export async function PasswordVerifierService(
	credentials: Credentials,
	user: User,
	passwordCipher: PasswordCipher,
): Promise<boolean> {
	const isPasswordCorrect = await passwordCipher.compare(
		credentials.password,
		user.password,
	);

	return isPasswordCorrect;
}
