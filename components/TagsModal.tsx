import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { X, Save, Plus, Search } from 'lucide-react-native';
import { useTagsService } from '@/services/TagsService';
import TagChip from './TagChip';

type TagsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (selectedTagIds: string[]) => Promise<void>;
  bookTags: string[];
};

export default function TagsModal({ 
  visible, 
  onClose, 
  onSave,
  bookTags
}: TagsModalProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const { tags, isLoading, createTag } = useTagsService();

  // Filter tags based on search query
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (visible) {
      setSelectedTagIds(bookTags || []);
      setSearchQuery('');
      setError(null);
      setNewTagName('');
      setIsAddingTag(false);
    }
  }, [visible, bookTags]);

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) {
      return;
    }

    setIsAddingTag(true);
    setError(null);

    try {
      const newTag = await createTag(newTagName.trim());
      setSelectedTagIds(prev => [...prev, newTag.id]);
      setNewTagName('');
    } catch (err) {
      setError('Failed to create tag. Please try again.');
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave(selectedTagIds);
    } catch (err) {
      setError('Failed to update tags. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Manage Tags
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            {/* Search Tags */}
            <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
              <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search tags..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Add New Tag */}
            <View style={styles.addTagContainer}>
              <View style={[styles.addTagInputContainer, { backgroundColor: colors.background }]}>
                <TextInput
                  style={[styles.addTagInput, { color: colors.text }]}
                  placeholder="Create new tag..."
                  placeholderTextColor={colors.textSecondary}
                  value={newTagName}
                  onChangeText={setNewTagName}
                />
                <TouchableOpacity
                  style={[styles.addTagButton, { 
                    backgroundColor: colors.primary,
                    opacity: (!newTagName.trim() || isAddingTag) ? 0.5 : 1
                  }]}
                  onPress={handleAddNewTag}
                  disabled={!newTagName.trim() || isAddingTag}
                >
                  {isAddingTag ? (
                    <ActivityIndicator size="small\" color="white" />
                  ) : (
                    <Plus size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Tags List */}
            <View style={styles.tagsListContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Available Tags
              </Text>
              
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
              ) : filteredTags.length === 0 ? (
                <View style={[styles.emptyContainer, { backgroundColor: colors.cardAlt }]}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    {searchQuery ? 'No tags match your search' : 'No tags available'}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.tagsList}>
                  <View style={styles.tagsGrid}>
                    {filteredTags.map(tag => (
                      <TouchableOpacity
                        key={tag.id}
                        onPress={() => handleToggleTag(tag.id)}
                        style={styles.tagItem}
                      >
                        <View style={[
                          styles.checkbox,
                          { 
                            borderColor: colors.primary,
                            backgroundColor: selectedTagIds.includes(tag.id) 
                              ? colors.primary 
                              : 'transparent'
                          }
                        ]}>
                          {selectedTagIds.includes(tag.id) && (
                            <View style={styles.checkmark} />
                          )}
                        </View>
                        <Text style={[styles.tagName, { color: colors.text }]}>
                          {tag.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* Selected Tags */}
            <View style={styles.selectedTagsContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Selected Tags ({selectedTagIds.length})
              </Text>
              
              {selectedTagIds.length === 0 ? (
                <View style={[styles.emptyContainer, { backgroundColor: colors.cardAlt }]}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No tags selected
                  </Text>
                </View>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedTagsList}
                >
                  {selectedTagIds.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    
                    return (
                      <TouchableOpacity
                        key={tag.id}
                        onPress={() => handleToggleTag(tag.id)}
                        style={[styles.selectedTag, { backgroundColor: colors.primary }]}
                      >
                        <Text style={styles.selectedTagText}>{tag.name}</Text>
                        <X size={14} color="white" />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { 
                  backgroundColor: colors.primary,
                  opacity: isSubmitting ? 0.7 : 1
                }]}
                onPress={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small\" color="white" />
                ) : (
                  <>
                    <Save size={16} color="white" style={styles.saveButtonIcon} />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
  },
  modalContent: {
    padding: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
  },
  addTagContainer: {
    marginBottom: 16,
  },
  addTagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addTagInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
  },
  addTagButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsListContainer: {
    flex: 1,
    marginBottom: 16,
    maxHeight: 200,
  },
  sectionTitle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  loader: {
    marginVertical: 16,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  tagsList: {
    flex: 1,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  tagName: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
  },
  selectedTagsContainer: {
    marginBottom: 16,
  },
  selectedTagsList: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
  },
  selectedTagText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
    color: 'white',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
});