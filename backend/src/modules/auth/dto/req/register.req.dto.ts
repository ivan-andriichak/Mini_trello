import { ApiProperty } from '@nestjs/swagger';

export class RegisterReqDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  surname: string;
}
