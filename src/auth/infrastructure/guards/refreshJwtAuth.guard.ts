import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { refreshTokenStrategy } from '../services/refreshJwtStrategy.service';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard(refreshTokenStrategy) {}
