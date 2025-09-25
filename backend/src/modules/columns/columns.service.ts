import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/migrations/prisma.service';
import { CreateColumnDto } from './dto/req/create-column.req.dto';
import { UpdateColumnDto } from './dto/req/update-column.req.dto';
import { ColumnResDto } from './dto/res/column.res.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  private async validateBoard(boardId: number, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
    return board;
  }

  private async validateColumn(boardId: number, columnId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { cards: { orderBy: { order: 'asc' } } },
    });
    if (!column || column.boardId !== boardId) {
      throw new NotFoundException(
        `Column with ID ${columnId} not found in board ${boardId}`,
      );
    }
    return column;
  }

  async create(
    boardId: number,
    createColumnDto: CreateColumnDto,
    userId: string,
  ): Promise<ColumnResDto> {
    await this.validateBoard(boardId, userId);
    // return the created column including empty cards array
    return await this.prisma.column.create({
      data: {
        title: createColumnDto.title,
        order: createColumnDto.order,
        boardId,
      },
      include: { cards: { orderBy: { order: 'asc' } } },
    });
  }

  async findAll(boardId: number, userId: string): Promise<ColumnResDto[]> {
    await this.validateBoard(boardId, userId);
    return await this.prisma.column.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
      include: { cards: { orderBy: { order: 'asc' } } },
    });
  }

  async findOne(
    boardId: number,
    id: number,
    userId: string,
  ): Promise<ColumnResDto> {
    await this.validateBoard(boardId, userId);
    return await this.validateColumn(boardId, id);
  }

  async update(
    boardId: number,
    id: number,
    updateColumnDto: UpdateColumnDto,
    userId: string,
  ): Promise<ColumnResDto> {
    await this.validateBoard(boardId, userId);
    await this.validateColumn(boardId, id);
    return await this.prisma.column.update({
      where: { id },
      data: updateColumnDto,
      include: { cards: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(boardId: number, id: number, userId: string): Promise<void> {
    await this.validateBoard(boardId, userId);
    await this.validateColumn(boardId, id);
    await this.prisma.column.delete({
      where: { id },
    });
  }
}
