import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { accessTokenStrategy } from '../services/accessJwtStrategy.service';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard(accessTokenStrategy) {}
