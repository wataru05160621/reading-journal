import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { Book, NewBook, TOCItem, Tag } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// This is a mock service for development
// In a real app, this would connect to Supabase or another backend

// Generate a mock TOC tree for sample data
const generateMockTOC = (): TOCItem[] => {
  return [
    {
      id: '1',
      title: 'Chapter 1: Introduction',
      comment: 'This chapter sets the foundation for the entire book.',
      children: [
        {
          id: '1.1',
          title: 'Section 1.1: Core Concepts',
          comment: '',
          children: []
        },
        {
          id: '1.2',
          title: 'Section 1.2: Historical Context',
          comment: 'The author provides excellent historical perspective here.',
          children: []
        }
      ]
    },
    {
      id: '2',
      title: 'Chapter 2: Main Ideas',
      comment: '',
      children: [
        {
          id: '2.1',
          title: 'Section 2.1: First Principle',
          comment: '',
          children: [
            {
              id: '2.1.1',
              title: 'Subsection 2.1.1: Applications',
              comment: 'This subsection contains practical examples.',
              children: []
            }
          ]
        },
        {
          id: '2.2',
          title: 'Section 2.2: Second Principle',
          comment: '',
          children: []
        }
      ]
    },
    {
      id: '3',
      title: 'Chapter 3: Advanced Topics',
      comment: '',
      children: []
    }
  ];
};

// Sample data for books
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    coverUrl: 'https://images.pexels.com/photos/5874600/pexels-photo-5874600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isbn: '9780857197689',
    isFavorite: true,
    tags: [
      { id: '1', name: 'Finance' },
      { id: '2', name: 'Psychology' }
    ],
    tableOfContents: generateMockTOC()
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images.pexels.com/photos/4466381/pexels-photo-4466381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isbn: '9781847941831',
    isFavorite: false,
    tags: [
      { id: '3', name: 'Self-Help' }
    ],
    tableOfContents: generateMockTOC()
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://images.pexels.com/photos/5874797/pexels-photo-5874797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isbn: '9780099590088',
    isFavorite: true,
    tags: [
      { id: '4', name: 'History' },
      { id: '5', name: 'Science' }
    ],
    tableOfContents: generateMockTOC()
  }
];

export const useBooksService = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { session } = useAuth();

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be a call to Supabase
      // const { data, error } = await supabase
      //   .from('books')
      //   .select('*')
      //   .eq('user_id', session?.user.id);
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      setBooks(mockBooks);
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  }, [fetchBooks]);

  useEffect(() => {
    if (session) {
      fetchBooks();
    }
  }, [session, fetchBooks]);

  const addBook = async (newBook: NewBook): Promise<Book> => {
    try {
      // In a real app, this would be a call to Supabase
      // const { data, error } = await supabase
      //   .from('books')
      //   .insert([{ ...newBook, user_id: session?.user.id }])
      //   .select()
      //   .single();
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock book with new ID
      const book: Book = {
        id: (books.length + 1).toString(),
        title: newBook.title,
        author: newBook.author,
        coverUrl: newBook.coverUrl,
        isbn: newBook.isbn,
        isFavorite: false,
        tags: [],
        tableOfContents: []
      };
      
      setBooks(prevBooks => [...prevBooks, book]);
      return book;
    } catch (err: any) {
      console.error('Error adding book:', err);
      throw new Error(err.message || 'Failed to add book');
    }
  };

  const deleteBook = async (bookId: string): Promise<void> => {
    try {
      // In a real app, this would be a call to Supabase
      // const { error } = await supabase
      //   .from('books')
      //   .delete()
      //   .eq('id', bookId)
      //   .eq('user_id', session?.user.id);
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove book from state
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    } catch (err: any) {
      console.error('Error deleting book:', err);
      throw new Error(err.message || 'Failed to delete book');
    }
  };

  const toggleFavorite = async (bookId: string): Promise<void> => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) throw new Error('Book not found');
      
      // In a real app, this would be a call to Supabase
      // const { error } = await supabase
      //   .from('books')
      //   .update({ is_favorite: !book.isFavorite })
      //   .eq('id', bookId)
      //   .eq('user_id', session?.user.id);
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update book in state
      setBooks(prevBooks =>
        prevBooks.map(b =>
          b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b
        )
      );
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      throw new Error(err.message || 'Failed to update favorite status');
    }
  };

  const updateBookTags = async (bookId: string, tagIds: string[]): Promise<void> => {
    try {
      // In a real app, this would involve multiple calls to Supabase
      // (delete existing book_tags and insert new ones)
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all available tags (this would come from a tags service in a real app)
      const allTags = Array.from(
        new Set(books.flatMap(book => book.tags))
      );
      
      // Filter to only the selected tags
      const selectedTags = allTags.filter(tag => tagIds.includes(tag.id));
      
      // Update book in state
      setBooks(prevBooks =>
        prevBooks.map(b =>
          b.id === bookId ? { ...b, tags: selectedTags } : b
        )
      );
    } catch (err: any) {
      console.error('Error updating book tags:', err);
      throw new Error(err.message || 'Failed to update book tags');
    }
  };

  const addCommentToTOCItem = async (bookId: string, tocItemId: string, comment: string): Promise<void> => {
    try {
      // In a real app, this would be a call to Supabase
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Helper function to update TOC item in a nested structure
      const updateTOCItem = (items: TOCItem[]): TOCItem[] => {
        return items.map(item => {
          if (item.id === tocItemId) {
            return { ...item, comment };
          }
          if (item.children.length > 0) {
            return { ...item, children: updateTOCItem(item.children) };
          }
          return item;
        });
      };
      
      // Update book in state
      setBooks(prevBooks =>
        prevBooks.map(book => {
          if (book.id === bookId) {
            return {
              ...book,
              tableOfContents: updateTOCItem(book.tableOfContents)
            };
          }
          return book;
        })
      );
    } catch (err: any) {
      console.error('Error adding comment:', err);
      throw new Error(err.message || 'Failed to add comment');
    }
  };

  return {
    books,
    isLoading,
    error,
    fetchBooks,
    refreshing,
    onRefresh,
    addBook,
    deleteBook,
    toggleFavorite,
    updateBookTags,
    addCommentToTOCItem
  };
};