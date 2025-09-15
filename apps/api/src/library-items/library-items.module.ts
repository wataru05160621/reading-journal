import { Module } from '@nestjs/common';
import { LibraryItemsController } from './library-items.controller';
import { LibraryItemsService } from './library-items.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [LibraryItemsController],
  providers: [LibraryItemsService, PrismaService],
})
export class LibraryItemsModule {}

