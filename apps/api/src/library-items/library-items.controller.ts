import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserGuard } from '../auth/user.guard';
import { LibraryItemsService } from './library-items.service';
import { CreateLibraryItemDto } from './dto/create-library-item.dto';
import { UpdateLibraryItemDto } from './dto/update-library-item.dto';

@UseGuards(UserGuard)
@Controller('library-items')
export class LibraryItemsController {
  constructor(private readonly service: LibraryItemsService) {}

  @Get()
  list(req: any) {
    return this.service.list(req.userId);
  }

  @Get(':id')
  get(@Param('id') id: string, req: any) {
    return this.service.get(req.userId, id);
  }

  @Post()
  create(@Body() dto: CreateLibraryItemDto, req: any) {
    return this.service.create(req.userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLibraryItemDto, req: any) {
    return this.service.update(req.userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, req: any) {
    return this.service.remove(req.userId, id);
  }
}

