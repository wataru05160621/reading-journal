import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { HealthController } from './health.controller';
import { LibraryItemsModule } from './library-items/library-items.module';
import { ReadingSessionsModule } from './reading-sessions/reading-sessions.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [SearchModule, LibraryItemsModule, ReadingSessionsModule, TagsModule],
  controllers: [HealthController]
})
export class AppModule {}
