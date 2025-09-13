import { IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  isbn?: string;
}

