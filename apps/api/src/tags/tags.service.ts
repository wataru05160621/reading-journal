import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.tag.findMany({ where: { userId }, orderBy: { name: 'asc' } });
  }

  async get(userId: string, id: string) {
    const t = await this.prisma.tag.findFirst({ where: { id, userId } });
    if (!t) throw new NotFoundException('Tag not found');
    return t;
  }

  async create(userId: string, dto: CreateTagDto) {
    try {
      return await this.prisma.tag.create({ data: { ...dto, userId } });
    } catch (e: any) {
      if (String(e?.code) === 'P2002') throw new ConflictException('Tag already exists');
      throw e;
    }
  }

  async update(userId: string, id: string, dto: UpdateTagDto) {
    await this.get(userId, id);
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.get(userId, id);
    await this.prisma.tag.delete({ where: { id } });
    return { ok: true };
  }

  async attach(userId: string, libraryItemId: string, tagId: string) {
    // ensure ownership
    const li = await this.prisma.libraryItem.findFirst({ where: { id: libraryItemId, userId } });
    if (!li) throw new NotFoundException('LibraryItem not found');
    const tag = await this.prisma.tag.findFirst({ where: { id: tagId, userId } });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.prisma.libraryItemTag.create({ data: { libraryItemId, tagId } });
    return { ok: true };
  }

  async detach(userId: string, libraryItemId: string, tagId: string) {
    await this.prisma.libraryItemTag.delete({ where: { libraryItemId_tagId: { libraryItemId, tagId } } });
    return { ok: true };
  }
}

