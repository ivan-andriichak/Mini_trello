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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/req/create-card.req.dto';
import { UpdateCardDto } from './dto/req/update-card.req.dto';
import { CardResDto } from './dto/res/card.res.dto';

@ApiTags('cards')
@Controller('boards/:boardId/columns/:columnId/cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card in a column' })
  @ApiResponse({ status: 201, description: 'Card created', type: CardResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board or column not found' })
  async create(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() createCardDto: CreateCardDto,
    @Request() req: any,
  ): Promise<CardResDto> {
    return await this.cardsService.create(
      +boardId,
      +columnId,
      createCardDto,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards in a column' })
  @ApiResponse({
    status: 200,
    description: 'List of cards',
    type: [CardResDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board or column not found' })
  async findAll(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Request() req: any,
  ): Promise<CardResDto[]> {
    return await this.cardsService.findAll(
      +boardId,
      +columnId,
      req.user.userId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiResponse({ status: 200, description: 'Card details', type: CardResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board, column, or card not found' })
  async findOne(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<CardResDto> {
    return await this.cardsService.findOne(
      +boardId,
      +columnId,
      +id,
      req.user.userId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({ status: 200, description: 'Updated card', type: CardResDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board, column, or card not found' })
  async update(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Request() req: any,
  ): Promise<CardResDto> {
    return await this.cardsService.update(
      +boardId,
      +columnId,
      +id,
      updateCardDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 200, description: 'Card deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Board, column, or card not found' })
  async remove(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    return await this.cardsService.remove(
      +boardId,
      +columnId,
      +id,
      req.user.userId,
    );
  }
}
