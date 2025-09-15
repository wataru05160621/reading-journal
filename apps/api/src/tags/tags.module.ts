import { Module } from '@nestjs/common';
import { TagsController, LibraryItemTagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [TagsController, LibraryItemTagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}

