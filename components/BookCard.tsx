import React from 'react';
import { 
  TouchableOpacity, 
  Image, 
  Text, 
  StyleSheet, 
  View,
  Platform
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { Book } from '@/types';
import { Heart } from 'lucide-react-native';

type BookCardProps = {
  book: Book;
  onPress: () => void;
};

export default function BookCard({ book, onPress }: BookCardProps) {
  const { theme } = useTheme();
  const colors = COLORS[theme];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: book.coverUrl }} 
          style={styles.cover}
          resizeMode="cover"
        />
        {book.isFavorite && (
          <View style={[styles.favoriteIcon, { backgroundColor: colors.primary }]}>
            <Heart size={12} color="white" fill="white" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text 
          style={[styles.title, { color: colors.text }]} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {book.title}
        </Text>
        <Text 
          style={[styles.author, { color: colors.textSecondary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {book.author}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  title: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  author: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
  },
});