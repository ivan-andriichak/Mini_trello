import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/migrations/prisma.module';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [PrismaModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
