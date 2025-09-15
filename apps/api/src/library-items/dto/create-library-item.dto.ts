import { IsEnum, IsISO8601, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ReadingStatus } from '@prisma/client';

export class CreateLibraryItemDto {
  @IsString()
  bookId!: string;

  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @IsOptional()
  @IsISO8601()
  startedAt?: string;

  @IsOptional()
  @IsISO8601()
  finishedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

