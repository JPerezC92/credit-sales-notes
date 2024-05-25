import type { RefreshPayload } from '@/auth/domain/refreshPayload';

import type { AccessPayload } from './accessPayload';
import type {
	AccessTokenCiphrationError,
	RefreshTokenCiphrationError,
} from './cipration.error';

export interface TokenCipher<T> {
	encode: (payload: T) => unknown;
}

export abstract class AccessTokenCipher implements TokenCipher<AccessPayload> {
	abstract encode(
		payload: AccessPayload,
	): string | AccessTokenCiphrationError;
}

export abstract class RefreshTokenCipher
	implements TokenCipher<RefreshPayload>
{
	abstract encode(
		payload: RefreshPayload,
	): string | RefreshTokenCiphrationError;
}
