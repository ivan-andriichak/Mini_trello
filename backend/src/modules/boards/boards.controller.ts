import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/req/create-board.req.dto';
import { UpdateBoardDto } from './dto/req/update-board.req.dto';
import { BoardResDto } from './dto/res/board.res.dto';

@ApiTags('boards')
@Controller('boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'Board created', type: BoardResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Request() req: any,
  ): Promise<BoardResDto> {
    return await this.boardsService.create(createBoardDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards for the user' })
  @ApiResponse({
    status: 200,
    description: 'List of boards',
    type: [BoardResDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req: any): Promise<BoardResDto[]> {
    return await this.boardsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by ID' })
  @ApiResponse({ status: 200, description: 'Board details', type: BoardResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<BoardResDto> {
    return await this.boardsService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a board' })
  @ApiResponse({ status: 200, description: 'Updated board', type: BoardResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req: any,
  ): Promise<BoardResDto> {
    return await this.boardsService.update(
      +id,
      updateBoardDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board' })
  @ApiResponse({ status: 200, description: 'Board deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    return await this.boardsService.remove(+id, req.user.userId);
  }
}
