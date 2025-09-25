import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    example: 'Implement feature X',
    description: 'Title of the card',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Add feature X to the project',
    description: 'Description of the card',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'Order of the card in the column' })
  @IsInt()
  @Min(0)
  order: number;
}
