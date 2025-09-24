import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res';

export class UserResDto extends PickType(BaseUserResDto, [
  'id',
  'email',
  'name',
  'createdAt',
  'updatedAt',
]) {}
