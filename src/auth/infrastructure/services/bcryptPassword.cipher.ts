import { Injectable } from '@nestjs/common';
import Bcrypt from 'bcrypt';

import type { PasswordCipher } from '@/auth/domain/password.cipher';

@Injectable()
export class BcryptPasswordCipher implements PasswordCipher {
	private readonly rounds = 10;
	async encrypt(plainPassword: string): Promise<string> {
		const salt = await Bcrypt.genSalt(this.rounds);

		return await Bcrypt.hash(plainPassword, salt);
	}

	async compare(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return await Bcrypt.compare(plainPassword, hashedPassword);
	}
}
