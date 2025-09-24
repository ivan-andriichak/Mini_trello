import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({
    example: 'Updated Project Board',
    description: 'Updated title of the board',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;
}
