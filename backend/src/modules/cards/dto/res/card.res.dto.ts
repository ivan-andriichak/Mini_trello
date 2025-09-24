import { ApiProperty } from '@nestjs/swagger';

export class CardResDto {
  @ApiProperty({ example: 1, description: 'ID of the card' })
  id: number;

  @ApiProperty({
    example: 'Implement feature X',
    description: 'Title of the card',
  })
  title: string;

  @ApiProperty({
    example: 'Add feature X to the project',
    description: 'Description of the card',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 1, description: 'Order of the card in the column' })
  order: number;

  @ApiProperty({
    example: '2025-09-16T12:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-09-16T12:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 1,
    description: 'ID of the column the card belongs to',
  })
  columnId: number;
}
