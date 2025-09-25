import { ApiProperty } from '@nestjs/swagger';

import { CardResDto } from '../../../cards/dto/res/card.res.dto';

export class ColumnResDto {
  @ApiProperty({ example: 1, description: 'ID of the column' })
  id: number;

  @ApiProperty({ example: 'To Do', description: 'Title of the column' })
  title: string;

  @ApiProperty({ example: 1, description: 'Order of the column in the board' })
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
    description: 'ID of the board the column belongs to',
  })
  boardId: number;

  @ApiProperty({
    description: 'Cards inside the column',
    type: [CardResDto],
  })
  cards: CardResDto[];
}
