import { ApiProperty } from '@nestjs/swagger';

import { TokenPairResDto } from './token-pair.res.dto';
import { UserResDto } from './user.res.dto';

export class AuthResDto {
  @ApiProperty({
    description: 'User details',
    type: UserResDto,
  })
  user: UserResDto;

  @ApiProperty({
    description: 'Token pair for authentication',
    type: TokenPairResDto,
  })
  tokens: TokenPairResDto;
}
