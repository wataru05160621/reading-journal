import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.dto';

@Controller('books')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get('search')
  async searchBooks(@Query() query: SearchQueryDto) {
    const items = await this.search.search(query);
    return { items };
  }
}

