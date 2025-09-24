import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty({
    example: 'Update feature X',
    description: 'Updated title of the card',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Updated description for feature X',
    description: 'Updated description of the card',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 2,
    description: 'Updated order of the card',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({
    example: 3,
    description: 'Move card to another column (column id)',
    required: false,
  })
  @IsInt()
  @IsOptional()
  columnId?: number;
}
