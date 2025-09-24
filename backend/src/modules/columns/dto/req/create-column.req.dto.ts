import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ example: 'To Do', description: 'Title of the column' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: 'Order of the column in the board' })
  @IsInt()
  @Min(0)
  order: number;
}
