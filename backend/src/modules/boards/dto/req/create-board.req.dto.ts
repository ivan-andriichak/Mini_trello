import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: 'My Project Board',
    description: 'Title of the board',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
