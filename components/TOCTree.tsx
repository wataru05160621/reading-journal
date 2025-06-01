import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS } from '@/constants/Colors';
import { TOCItem } from '@/types';
import { ChevronDown, ChevronRight, MessageCircle } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TOCTreeProps = {
  items: TOCItem[];
  onItemPress: (item: TOCItem) => void;
  level?: number;
};

export default function TOCTree({ items, onItemPress, level = 0 }: TOCTreeProps) {
  const { theme } = useTheme();
  const colors = COLORS[theme];

  return (
    <View style={[
      styles.container,
      level > 0 && { marginLeft: 16, borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: 8 }
    ]}>
      {items.map((item) => (
        <TOCTreeItem 
          key={item.id} 
          item={item} 
          level={level}
          onItemPress={onItemPress}
        />
      ))}
    </View>
  );
}

type TOCTreeItemProps = {
  item: TOCItem;
  level: number;
  onItemPress: (item: TOCItem) => void;
};

function TOCTreeItem({ item, level, onItemPress }: TOCTreeItemProps) {
  const [expanded, setExpanded] = useState(level < 1);
  const { theme } = useTheme();
  const colors = COLORS[theme];
  
  const hasChildren = item.children && item.children.length > 0;
  const hasComment = !!item.comment;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemRow}>
        {hasChildren ? (
          <TouchableOpacity 
            style={styles.expandButton} 
            onPress={toggleExpand}
          >
            {expanded ? (
              <ChevronDown size={16} color={colors.primary} />
            ) : (
              <ChevronRight size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.expandButton} />
        )}
        
        <Pressable
          style={[
            styles.itemContent,
            hasComment && { backgroundColor: colors.primaryLight + '20' }
          ]}
          onPress={() => onItemPress(item)}
          android_ripple={{ color: colors.border }}
        >
          <Text style={[
            styles.itemText, 
            { color: colors.text },
            level === 0 && styles.itemTextLevel0
          ]}>
            {item.title}
          </Text>
          
          {hasComment && (
            <MessageCircle 
              size={16} 
              color={colors.primary}
              style={styles.commentIcon}
            />
          )}
        </Pressable>
      </View>
      
      {hasChildren && expanded && (
        <TOCTree 
          items={item.children} 
          level={level + 1}
          onItemPress={onItemPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  itemContainer: {
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  itemText: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    flex: 1,
  },
  itemTextLevel0: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 16,
  },
  commentIcon: {
    marginLeft: 8,
  },
});