import React, { useState, useEffect } from 'react';
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
import { X, Save } from 'lucide-react-native';
import { TOCItem } from '@/types';

type AddCommentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (comment: string) => Promise<void>;
  tocItem: TOCItem | null;
  initialComment: string;
};

export default function AddCommentModal({ 
  visible, 
  onClose, 
  onSave,
  tocItem,
  initialComment
}: AddCommentModalProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { theme } = useTheme();
  const colors = COLORS[theme];

  useEffect(() => {
    if (visible) {
      setComment(initialComment || '');
      setError(null);
    }
  }, [visible, initialComment]);

  const handleSave = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave(comment);
    } catch (err) {
      setError('Failed to save comment. Please try again.');
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {initialComment ? 'Edit Comment' : 'Add Comment'}
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

            {tocItem && (
              <View style={[styles.sectionHeader, { backgroundColor: colors.cardAlt }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Section: {tocItem.title}
                </Text>
              </View>
            )}

            <View style={styles.commentContainer}>
              <TextInput
                style={[styles.commentInput, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background
                }]}
                placeholder="Enter your notes here..."
                placeholderTextColor={colors.textSecondary}
                value={comment}
                onChangeText={setComment}
                multiline
                textAlignVertical="top"
              />
            </View>

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
  sectionHeader: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentInput: {
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
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