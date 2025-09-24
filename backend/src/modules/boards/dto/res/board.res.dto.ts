import { ApiProperty } from '@nestjs/swagger';

export class BoardResDto {
  @ApiProperty({ example: 1, description: 'ID of the board' })
  id: number;

  @ApiProperty({
    example: 'My Project Board',
    description: 'Title of the board',
  })
  title: string;

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
    example: 'uuid-string',
    description: 'ID of the user who owns the board',
  })
  userId: string;

  @ApiProperty({ example: 1, description: 'Order of the board' })
  order: number | null;
}
