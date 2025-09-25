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
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/req/create-column.req.dto';
import { UpdateColumnDto } from './dto/req/update-column.req.dto';
import { ColumnResDto } from './dto/res/column.res.dto';

@ApiTags('columns')
@Controller('boards/:boardId/columns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new column in a board' })
  @ApiResponse({
    status: 201,
    description: 'Column created',
    type: ColumnResDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async create(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Request() req: any,
  ): Promise<ColumnResDto> {
    return await this.columnsService.create(
      +boardId,
      createColumnDto,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all columns in a board' })
  @ApiResponse({
    status: 200,
    description: 'List of columns',
    type: [ColumnResDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async findAll(
    @Param('boardId') boardId: string,
    @Request() req: any,
  ): Promise<ColumnResDto[]> {
    return await this.columnsService.findAll(+boardId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a column by ID' })
  @ApiResponse({
    status: 200,
    description: 'Column details',
    type: ColumnResDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board or column not found' })
  async findOne(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ColumnResDto> {
    return await this.columnsService.findOne(+boardId, +id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({
    status: 200,
    description: 'Updated column',
    type: ColumnResDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board or column not found' })
  async update(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Request() req: any,
  ): Promise<ColumnResDto> {
    return await this.columnsService.update(
      +boardId,
      +id,
      updateColumnDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({ status: 200, description: 'Column deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board or column not found' })
  async remove(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    return await this.columnsService.remove(+boardId, +id, req.user.userId);
  }
}
