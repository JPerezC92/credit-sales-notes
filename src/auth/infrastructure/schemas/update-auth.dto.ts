import { PartialType } from '@nestjs/swagger';

import { CredentialsDto } from './credentials.schema';

export class UpdateAuthDto extends PartialType(CredentialsDto) {}
