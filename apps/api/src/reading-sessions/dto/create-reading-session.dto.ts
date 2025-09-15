import { IsISO8601, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateReadingSessionDto {
  @IsString()
  libraryItemId!: string;

  @IsISO8601()
  startedAt!: string;

  @IsOptional()
  @IsISO8601()
  endedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

