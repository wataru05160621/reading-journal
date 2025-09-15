import { Module } from '@nestjs/common';
import { ReadingSessionsController } from './reading-sessions.controller';
import { ReadingSessionsService } from './reading-sessions.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ReadingSessionsController],
  providers: [ReadingSessionsService, PrismaService],
})
export class ReadingSessionsModule {}

