import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { 
  ArrowLeft, 
  Heart, 
  Tag, 
  MessageSquare, 
  Edit,
  Trash,
  ChevronDown,
  ChevronRight
} from 'lucide-react-native';
import { useBooksService } from '@/services/BooksService';
import { Book, TOCItem } from '@/types';
import TOCTree from '@/components/TOCTree';
import AddCommentModal from '@/components/AddCommentModal';
import TagsModal from '@/components/TagsModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function BookDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const [selectedTOCItem, setSelectedTOCItem] = useState<TOCItem | null>(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isTagsModalVisible, setIsTagsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const { 
    books, 
    isLoading, 
    error, 
    toggleFavorite,
    deleteBook,
    updateBookTags,
    addCommentToTOCItem
  } = useBooksService();

  const book = books.find(b => b.id === id) as Book | undefined;

  const handleBackPress = () => {
    router.back();
  };

  const handleToggleFavorite = async () => {
    if (book) {
      await toggleFavorite(book.id);
    }
  };

  const handleManageTags = () => {
    setIsTagsModalVisible(true);
  };

  const handleTagsUpdate = async (selectedTagIds: string[]) => {
    if (book) {
      await updateBookTags(book.id, selectedTagIds);
      setIsTagsModalVisible(false);
    }
  };

  const handleTOCItemPress = (item: TOCItem) => {
    setSelectedTOCItem(item);
    setIsCommentModalVisible(true);
  };

  const handleSaveComment = async (comment: string) => {
    if (book && selectedTOCItem) {
      await addCommentToTOCItem(book.id, selectedTOCItem.id, comment);
      setIsCommentModalVisible(false);
    }
  };

  const handleDeleteBook = async () => {
    if (book) {
      await deleteBook(book.id);
      router.replace('/(tabs)');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error || 'Book not found'}
        </Text>
        <TouchableOpacity 
          style={[styles.errorButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.errorButtonText}>Go to Bookshelf</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Book Cover Header */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={[styles.coverOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={handleBackPress}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.rightButtons}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                onPress={handleToggleFavorite}
              >
                <Heart 
                  size={24} 
                  color="white" 
                  fill={book.isFavorite ? 'white' : 'none'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                onPress={handleManageTags}
              >
                <Tag size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                onPress={() => setIsDeleteModalVisible(true)}
              >
                <Trash size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>by {book.author}</Text>
            
            {book.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {book.tags.slice(0, 3).map((tag) => (
                  <View key={tag.id} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))}
                {book.tags.length > 3 && (
                  <Text style={styles.moreTags}>+{book.tags.length - 3}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Table of Contents */}
        <View style={styles.tocContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Table of Contents
          </Text>
          
          {book.tableOfContents.length === 0 ? (
            <View style={[styles.emptyTOC, { backgroundColor: colors.cardAlt }]}>
              <Text style={[styles.emptyTOCText, { color: colors.textSecondary }]}>
                No table of contents available
              </Text>
            </View>
          ) : (
            <TOCTree 
              items={book.tableOfContents} 
              onItemPress={handleTOCItemPress}
            />
          )}
        </View>
      </View>

      {/* Add/Edit Comment Modal */}
      <AddCommentModal
        visible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        onSave={handleSaveComment}
        tocItem={selectedTOCItem}
        initialComment={selectedTOCItem?.comment || ''}
      />

      {/* Tags Modal */}
      <TagsModal
        visible={isTagsModalVisible}
        onClose={() => setIsTagsModalVisible(false)}
        onSave={handleTagsUpdate}
        bookTags={book.tags.map(tag => tag.id)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteBook}
        title="Delete Book"
        message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
  coverContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerButtons: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  bookTitle: {
    color: 'white',
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bookAuthor: {
    color: 'white',
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  tagText: {
    color: 'white',
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
  },
  moreTags: {
    color: 'white',
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    alignSelf: 'center',
  },
  tocContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  emptyTOC: {
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyTOCText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
});