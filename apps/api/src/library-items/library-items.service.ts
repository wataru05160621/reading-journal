import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLibraryItemDto } from './dto/create-library-item.dto';
import { UpdateLibraryItemDto } from './dto/update-library-item.dto';

@Injectable()
export class LibraryItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.libraryItem.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async get(userId: string, id: string) {
    const item = await this.prisma.libraryItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('LibraryItem not found');
    return item;
  }

  async create(userId: string, dto: CreateLibraryItemDto) {
    return this.prisma.libraryItem.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateLibraryItemDto) {
    await this.get(userId, id);
    return this.prisma.libraryItem.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.get(userId, id);
    await this.prisma.libraryItem.delete({ where: { id } });
    return { ok: true };
  }
}

