export type IsoDate = string;

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedAt?: IsoDate;
}

export const version = '0.0.0';
