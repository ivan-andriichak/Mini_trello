import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/migrations/prisma.service';
import { CreateCardDto } from './dto/req/create-card.req.dto';
import { UpdateCardDto } from './dto/req/update-card.req.dto';
import { CardResDto } from './dto/res/card.res.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  private async validateBoardAndColumn(
    boardId: number,
    columnId: number,
    userId: string,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
    });
    if (!column || column.boardId !== boardId) {
      throw new NotFoundException(
        `Column with ID ${columnId} not found in board ${boardId}`,
      );
    }
    return { board, column };
  }

  async create(
    boardId: number,
    columnId: number,
    createCardDto: CreateCardDto,
    userId: string,
  ): Promise<CardResDto> {
    await this.validateBoardAndColumn(boardId, columnId, userId);
    return await this.prisma.card.create({
      data: {
        title: createCardDto.title,
        description: createCardDto.description,
        order: createCardDto.order,
        columnId,
      },
    });
  }

  async findAll(
    boardId: number,
    columnId: number,
    userId: string,
  ): Promise<CardResDto[]> {
    await this.validateBoardAndColumn(boardId, columnId, userId);
    return await this.prisma.card.findMany({
      where: { columnId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(
    boardId: number,
    columnId: number,
    id: number,
    userId: string,
  ): Promise<CardResDto> {
    await this.validateBoardAndColumn(boardId, columnId, userId);
    const card = await this.prisma.card.findUnique({
      where: { id },
    });
    if (!card || card.columnId !== columnId) {
      throw new NotFoundException(
        `Card with ID ${id} not found in column ${columnId}`,
      );
    }
    return card;
  }

  async update(
    boardId: number,
    columnId: number,
    id: number,
    updateCardDto: UpdateCardDto,
    userId: string,
  ): Promise<CardResDto> {
    // 1) Validate board ownership
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }

    // 2) Load card with its column to validate it belongs to the same board
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { column: true },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    if (!card.column || card.column.boardId !== boardId) {
      // card exists but belongs to another board -> not allowed
      throw new NotFoundException(
        `Card with ID ${id} not found in board ${boardId}`,
      );
    }

    // 3) If move requested (columnId provided and different), validate target column belongs to board
    if (
      updateCardDto.columnId !== undefined &&
      updateCardDto.columnId !== card.columnId
    ) {
      const targetColumn = await this.prisma.column.findUnique({
        where: { id: updateCardDto.columnId },
      });
      if (!targetColumn || targetColumn.boardId !== boardId) {
        throw new NotFoundException(
          `Target column with ID ${updateCardDto.columnId} not found in board ${boardId}`,
        );
      }
    }

    // 4) Perform update (allow changing columnId and/or order and other fields)
    return await this.prisma.card.update({
      where: { id },
      data: {
        title: updateCardDto.title ?? undefined,
        description: updateCardDto.description ?? undefined,
        order: updateCardDto.order ?? undefined,
        columnId: updateCardDto.columnId ?? undefined,
      },
    });
  }

  async remove(
    boardId: number,
    columnId: number,
    id: number,
    userId: string,
  ): Promise<void> {
    await this.validateBoardAndColumn(boardId, columnId, userId);
    const card = await this.prisma.card.findUnique({
      where: { id },
    });
    if (!card || card.columnId !== columnId) {
      throw new NotFoundException(
        `Card with ID ${id} not found in column ${columnId}`,
      );
    }
    await this.prisma.card.delete({
      where: { id },
    });
  }
}
