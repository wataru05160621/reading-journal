import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { X, Search, Book } from 'lucide-react-native';
import { useBooksService } from '@/services/BooksService';

type AddBookModalProps = {
  visible: boolean;
  onClose: () => void;
  onBookAdded: () => void;
};

export default function AddBookModal({ visible, onClose, onBookAdded }: AddBookModalProps) {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingManually, setIsAddingManually] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const { addBook } = useBooksService();

  const handleSearch = async () => {
    if (!isbn.trim()) {
      setError('Please enter an ISBN');
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      // Mock API call for ISBN lookup
      // In a real app, you would call your book API here
      setTimeout(() => {
        // Simulate book found
        setTitle('The Great Gatsby');
        setAuthor('F. Scott Fitzgerald');
        setCoverUrl('https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
        setIsSearching(false);
      }, 1500);
    } catch (err) {
      setError('Failed to find book. Try adding manually.');
      setIsSearching(false);
    }
  };

  const handleAddBook = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!author.trim()) {
      setError('Author is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const defaultCover = 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
      
      await addBook({
        title,
        author,
        coverUrl: coverUrl || defaultCover,
        isbn: isbn || 'N/A'
      });
      
      // Reset form
      setIsbn('');
      setTitle('');
      setAuthor('');
      setCoverUrl('');
      setIsAddingManually(false);
      
      // Close modal and refresh books
      onClose();
      onBookAdded();
    } catch (err) {
      setError('Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsbn('');
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setIsAddingManually(false);
    setError(null);
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add New Book
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            {!isAddingManually && !title && (
              <View style={styles.isbnSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Search by ISBN
                </Text>
                <View style={styles.isbnInputContainer}>
                  <TextInput
                    style={[styles.isbnInput, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.background
                    }]}
                    placeholder="Enter ISBN"
                    placeholderTextColor={colors.textSecondary}
                    value={isbn}
                    onChangeText={setIsbn}
                    keyboardType="numeric"
                    editable={!isSearching}
                  />
                  <TouchableOpacity
                    style={[styles.searchButton, { 
                      backgroundColor: colors.primary,
                      opacity: isSearching ? 0.7 : 1
                    }]}
                    onPress={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Search size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.manualButton}
                  onPress={() => setIsAddingManually(true)}
                >
                  <Text style={[styles.manualButtonText, { color: colors.primary }]}>
                    Add book manually instead
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {(isAddingManually || title) && (
              <View style={styles.formSection}>
                {title && !isAddingManually && (
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Book Found
                  </Text>
                )}

                {isAddingManually && (
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Book Details
                  </Text>
                )}

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Title</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.background
                    }]}
                    placeholder="Book title"
                    placeholderTextColor={colors.textSecondary}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Author</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.background
                    }]}
                    placeholder="Book author"
                    placeholderTextColor={colors.textSecondary}
                    value={author}
                    onChangeText={setAuthor}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Cover URL (optional)</Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.background
                    }]}
                    placeholder="https://example.com/cover.jpg"
                    placeholderTextColor={colors.textSecondary}
                    value={coverUrl}
                    onChangeText={setCoverUrl}
                  />
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.resetButton, { borderColor: colors.border }]}
                    onPress={handleReset}
                  >
                    <Text style={[styles.resetButtonText, { color: colors.text }]}>
                      Reset
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.addButton, { 
                      backgroundColor: colors.primary,
                      opacity: isSubmitting ? 0.7 : 1
                    }]}
                    onPress={handleAddBook}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Book size={16} color="white" style={styles.addButtonIcon} />
                        <Text style={styles.addButtonText}>Add Book</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      },
    }),
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
  isbnSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  isbnInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  isbnInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  manualButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  manualButtonText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  formSection: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resetButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
  },
  addButton: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
});