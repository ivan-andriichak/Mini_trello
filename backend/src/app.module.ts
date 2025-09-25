import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/migrations/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BoardsModule } from './modules/boards/boards.module';
import { CardsModule } from './modules/cards/cards.module';
import { ColumnsModule } from './modules/columns/columns.module';

@Module({
  imports: [PrismaModule, AuthModule, BoardsModule, ColumnsModule, CardsModule],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule {}
