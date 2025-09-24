import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/migrations/prisma.service';
import { CreateBoardDto } from './dto/req/create-board.req.dto';
import { UpdateBoardDto } from './dto/req/update-board.req.dto';
import { BoardResDto } from './dto/res/board.res.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<BoardResDto> {
    return await this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        userId,
      },
    });
  }

  async findAll(userId: string): Promise<BoardResDto[]> {
    return await this.prisma.board.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId: string): Promise<BoardResDto> {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
    return board;
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<BoardResDto> {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
    return await this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
    });
  }

  async remove(id: number, userId: string): Promise<void> {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
    await this.prisma.board.delete({
      where: { id },
    });
  }
}
