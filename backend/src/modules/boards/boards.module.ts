﻿import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/migrations/prisma.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [PrismaModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
