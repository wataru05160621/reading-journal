import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserGuard } from '../auth/user.guard';
import { ReadingSessionsService } from './reading-sessions.service';
import { CreateReadingSessionDto } from './dto/create-reading-session.dto';
import { UpdateReadingSessionDto } from './dto/update-reading-session.dto';

@UseGuards(UserGuard)
@Controller('reading-sessions')
export class ReadingSessionsController {
  constructor(private readonly service: ReadingSessionsService) {}

  @Get()
  list(@Query('libraryItemId') libraryItemId: string | undefined, req: any) {
    return this.service.list(req.userId, libraryItemId);
  }

  @Get(':id')
  get(@Param('id') id: string, req: any) {
    return this.service.get(req.userId, id);
  }

  @Post()
  create(@Body() dto: CreateReadingSessionDto, req: any) {
    return this.service.create(req.userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReadingSessionDto, req: any) {
    return this.service.update(req.userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, req: any) {
    return this.service.remove(req.userId, id);
  }
}

