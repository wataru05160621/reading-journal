import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserGuard } from '../auth/user.guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@UseGuards(UserGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Get()
  list(req: any) { return this.service.list(req.userId); }

  @Get(':id')
  get(@Param('id') id: string, req: any) { return this.service.get(req.userId, id); }

  @Post()
  create(@Body() dto: CreateTagDto, req: any) { return this.service.create(req.userId, dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto, req: any) { return this.service.update(req.userId, id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string, req: any) { return this.service.remove(req.userId, id); }
}

@UseGuards(UserGuard)
@Controller('library-items/:id/tags')
export class LibraryItemTagsController {
  constructor(private readonly service: TagsService) {}

  @Post()
  attach(@Param('id') libraryItemId: string, @Body('tagId') tagId: string, req: any) {
    return this.service.attach(req.userId, libraryItemId, tagId);
  }

  @Delete(':tagId')
  detach(@Param('id') libraryItemId: string, @Param('tagId') tagId: string, req: any) {
    return this.service.detach(req.userId, libraryItemId, tagId);
  }
}

