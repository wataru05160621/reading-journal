import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { Tag as TagType } from '@/types';
import { X } from 'lucide-react-native';

type TagChipProps = {
  tag: TagType;
  onPress: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
};

export default function TagChip({ tag, onPress, onDelete, isSelected = false }: TagChipProps) {
  const { theme } = useTheme();
  const colors = COLORS[theme];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: isSelected ? colors.primary : colors.cardAlt,
          borderColor: isSelected ? colors.primary : colors.border,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        { color: isSelected ? 'white' : colors.text }
      ]}>
        {tag.name}
      </Text>
      
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <X 
            size={14} 
            color={isSelected ? 'white' : colors.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 6,
  },
});