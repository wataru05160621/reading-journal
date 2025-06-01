export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  isbn: string;
  isFavorite: boolean;
  tags: Tag[];
  tableOfContents: TOCItem[];
};

export type NewBook = {
  title: string;
  author: string;
  coverUrl: string;
  isbn: string;
};

export type TOCItem = {
  id: string;
  title: string;
  comment: string;
  children: TOCItem[];
};

export type Tag = {
  id: string;
  name: string;
};