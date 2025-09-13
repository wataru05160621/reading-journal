import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CacheService } from '../shared/cache.service';
import { GoogleProvider } from '../shared/providers/google.provider';
import { OpenLibraryProvider } from '../shared/providers/openlibrary.provider';

@Module({
  providers: [SearchService, CacheService, GoogleProvider, OpenLibraryProvider],
  controllers: [SearchController],
})
export class SearchModule {}

