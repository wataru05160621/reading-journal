import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { Tag, Plus, X, ChevronRight } from 'lucide-react-native';
import { useTagsService } from '@/services/TagsService';
import { useBooksService } from '@/services/BooksService';
import TagChip from '@/components/TagChip';
import AddTagModal from '@/components/AddTagModal';
import BookCard from '@/components/BookCard';

export default function Tags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const router = useRouter();
  
  const { 
    tags, 
    isLoading: tagsLoading, 
    error: tagsError,
    createTag,
    deleteTag,
    fetchTags
  } = useTagsService();
  
  const { 
    books, 
    isLoading: booksLoading
  } = useBooksService();

  // Filter tags based on search query
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get books for selected tag
  const booksWithTag = selectedTag 
    ? books.filter(book => book.tags.some(tag => tag.id === selectedTag))
    : [];

  const handleTagPress = (tagId: string) => {
    setSelectedTag(tagId);
  };

  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleAddTag = async (tagName: string) => {
    await createTag(tagName);
    setIsAddModalVisible(false);
  };

  const handleDeleteTag = async (tagId: string) => {
    await deleteTag(tagId);
    if (selectedTag === tagId) {
      setSelectedTag(null);
    }
  };

  // Clear selected tag when it's deleted
  useEffect(() => {
    if (selectedTag && !tags.find(tag => tag.id === selectedTag)) {
      setSelectedTag(null);
    }
  }, [tags, selectedTag]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tag selection section */}
      <View style={styles.tagSection}>
        <View style={styles.tagHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tags
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Plus size={16} color="white" />
            <Text style={styles.addButtonText}>Add Tag</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tags..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {tagsError && (
          <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {tagsError}
            </Text>
          </View>
        )}

        {tagsLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  onPress={() => handleTagPress(tag.id)}
                  onDelete={() => handleDeleteTag(tag.id)}
                  isSelected={selectedTag === tag.id}
                />
              ))
            ) : (
              <View style={[styles.emptyTagsContainer, { backgroundColor: colors.cardAlt }]}>
                <Text style={[styles.emptyTagsText, { color: colors.textSecondary }]}>
                  {searchQuery.length > 0 ? 'No tags match your search' : 'No tags yet'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Books with selected tag */}
      {selectedTag && (
        <View style={styles.booksSection}>
          <View style={styles.booksSectionHeader}>
            <Text style={[styles.booksSectionTitle, { color: colors.text }]}>
              Books with{' '}
              <Text style={{ color: colors.primary }}>
                {tags.find(tag => tag.id === selectedTag)?.name}
              </Text>
            </Text>
            <TouchableOpacity 
              style={styles.clearSelection}
              onPress={() => setSelectedTag(null)}
            >
              <X size={16} color={colors.primary} />
              <Text style={[styles.clearSelectionText, { color: colors.primary }]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          {booksLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.booksLoader} />
          ) : (
            <FlatList
              data={booksWithTag}
              renderItem={({ item }) => (
                <BookCard
                  book={item}
                  onPress={() => handleBookPress(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.grid}
              ListEmptyComponent={
                <View style={styles.emptyBooksContainer}>
                  <Text style={[styles.emptyBooksText, { color: colors.textSecondary }]}>
                    No books with this tag yet
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* Empty state when no tag is selected */}
      {!selectedTag && tags.length > 0 && (
        <View style={styles.noSelectionContainer}>
          <Tag size={48} color={colors.textSecondary} />
          <Text style={[styles.noSelectionTitle, { color: colors.text }]}>
            Select a Tag
          </Text>
          <Text style={[styles.noSelectionText, { color: colors.textSecondary }]}>
            Tap on a tag to view books with that tag
          </Text>
        </View>
      )}

      {/* Add Tag Modal */}
      <AddTagModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddTag={handleAddTag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  loader: {
    marginVertical: 16,
  },
  tagsContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 8,
  },
  emptyTagsContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  emptyTagsText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  booksSection: {
    flex: 1,
    marginTop: 16,
  },
  booksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  booksSectionTitle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
  clearSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearSelectionText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  grid: {
    padding: 8,
  },
  booksLoader: {
    marginTop: 32,
  },
  emptyBooksContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyBooksText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
  },
  noSelectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noSelectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  noSelectionText: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});