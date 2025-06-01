import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { Tag } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Sample data for tags
const mockTags: Tag[] = [
  { id: '1', name: 'Finance' },
  { id: '2', name: 'Psychology' },
  { id: '3', name: 'Self-Help' },
  { id: '4', name: 'History' },
  { id: '5', name: 'Science' },
  { id: '6', name: 'Fiction' },
  { id: '7', name: 'Business' },
  { id: '8', name: 'Philosophy' }
];

export const useTagsService = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be a call to Supabase
      // const { data, error } = await supabase
      //   .from('tags')
      //   .select('*')
      //   .eq('user_id', session?.user.id);
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      setTags(mockTags);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      setError(err.message || 'Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTags();
    }
  }, [session, fetchTags]);

  const createTag = async (name: string): Promise<Tag> => {
    try {
      // In a real app, this would be a call to Supabase
      // const { data, error } = await supabase
      //   .from('tags')
      //   .insert([{ name, user_id: session?.user.id }])
      //   .select()
      //   .single();
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create mock tag with new ID
      const newTag: Tag = {
        id: (tags.length + 1).toString(),
        name
      };
      
      setTags(prevTags => [...prevTags, newTag]);
      return newTag;
    } catch (err: any) {
      console.error('Error creating tag:', err);
      throw new Error(err.message || 'Failed to create tag');
    }
  };

  const deleteTag = async (tagId: string): Promise<void> => {
    try {
      // In a real app, this would be a call to Supabase
      // const { error } = await supabase
      //   .from('tags')
      //   .delete()
      //   .eq('id', tagId)
      //   .eq('user_id', session?.user.id);
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove tag from state
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      throw new Error(err.message || 'Failed to delete tag');
    }
  };

  const updateTag = async (tagId: string, name: string): Promise<Tag> => {
    try {
      // In a real app, this would be a call to Supabase
      // const { data, error } = await supabase
      //   .from('tags')
      //   .update({ name })
      //   .eq('id', tagId)
      //   .eq('user_id', session?.user.id)
      //   .select()
      //   .single();
      
      // if (error) throw new Error(error.message);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update tag in state
      const updatedTags = tags.map(tag =>
        tag.id === tagId ? { ...tag, name } : tag
      );
      
      setTags(updatedTags);
      return updatedTags.find(tag => tag.id === tagId) as Tag;
    } catch (err: any) {
      console.error('Error updating tag:', err);
      throw new Error(err.message || 'Failed to update tag');
    }
  };

  return {
    tags,
    isLoading,
    error,
    fetchTags,
    createTag,
    deleteTag,
    updateTag
  };
};