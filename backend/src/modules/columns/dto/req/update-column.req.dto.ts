import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateColumnDto {
  @ApiProperty({
    example: 'In Progress',
    description: 'Updated title of the column',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 2,
    description: 'Updated order of the column',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
