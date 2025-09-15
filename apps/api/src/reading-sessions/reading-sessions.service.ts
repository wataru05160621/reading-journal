import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReadingSessionDto } from './dto/create-reading-session.dto';
import { UpdateReadingSessionDto } from './dto/update-reading-session.dto';

@Injectable()
export class ReadingSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, libraryItemId?: string) {
    return this.prisma.readingSession.findMany({
      where: { userId, ...(libraryItemId ? { libraryItemId } : {}) },
      orderBy: { startedAt: 'desc' },
    });
  }

  async get(userId: string, id: string) {
    const it = await this.prisma.readingSession.findFirst({ where: { id, userId } });
    if (!it) throw new NotFoundException('ReadingSession not found');
    return it;
  }

  async create(userId: string, dto: CreateReadingSessionDto) {
    // ensure ownership of libraryItem
    const li = await this.prisma.libraryItem.findFirst({ where: { id: dto.libraryItemId, userId } });
    if (!li) throw new NotFoundException('LibraryItem not found');
    return this.prisma.readingSession.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateReadingSessionDto) {
    await this.get(userId, id);
    return this.prisma.readingSession.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.get(userId, id);
    await this.prisma.readingSession.delete({ where: { id } });
    return { ok: true };
  }
}

