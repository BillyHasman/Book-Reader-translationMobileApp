import React, { useRef, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const BookCard = ({ book, onPress, onLongPress, isGrid }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const dateStr = useMemo(() => {
    return new Date(book.lastReadTime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }, [book.lastReadTime])

  const CategoryBadge = () => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{book.category || 'Umum'}</Text>
    </View>
  )

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start()
  }

  let iconName = 'picture-as-pdf'
  let iconColor = '#FF5252'

  if (book.type === 'epub') {
    iconColor = '#4CAF50'
    iconName = 'book'
  } else if (book.type === 'lit') {
    iconColor = '#607D8B'
    iconName = 'description'
  }

  const renderContent = () => {
    if (isGrid) {
      return (
        <View style={styles.cardGridContent}>
          <View style={[styles.iconBoxGrid, { backgroundColor: iconColor }]}>
            <MaterialIcons name={iconName} size={40} color='white' />
          </View>
          <View style={styles.infoGrid}>
            <Text style={styles.titleGrid} numberOfLines={2}>
              {book.name}
            </Text>
            <View style={{ alignItems: 'center', marginVertical: 4 }}>
              <CategoryBadge />
            </View>
            <View style={styles.footerGrid}>
              <View style={styles.rowIcon}>
                <MaterialIcons name='auto-stories' size={12} color='#555' />
                <Text style={styles.metaText}> {book.lastPage}</Text>
              </View>
              <View style={styles.rowIcon}>
                <MaterialIcons name='access-time' size={12} color='#888' />
                <Text style={styles.metaTextTiny}>
                  {' '}
                  {dateStr.split(',')[1] || dateStr}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.cardListContent}>
        <View style={[styles.iconBoxList, { backgroundColor: iconColor }]}>
          <MaterialIcons name={iconName} size={32} color='white' />
        </View>
        <View style={styles.infoList}>
          <Text style={styles.titleList} numberOfLines={1}>
            {book.name}
          </Text>
          <View style={styles.rowMiddle}>
            <CategoryBadge />
            <View style={styles.dotSeparator} />
            <View style={styles.rowIcon}>
              <MaterialIcons name='auto-stories' size={14} color='#333' />
              <Text style={styles.metaHighlight}> Hal. {book.lastPage}</Text>
            </View>
          </View>
          <View style={styles.rowBottom}>
            <MaterialIcons name='access-time' size={12} color='#888' />
            <Text style={styles.metaDate}> {dateStr}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
    >
      <Animated.View
        style={[
          isGrid ? styles.cardGridContainer : styles.cardListContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {renderContent()}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default React.memo(BookCard, (prevProps, nextProps) => {
  return (
    prevProps.book.id === nextProps.book.id &&
    prevProps.book.lastPage === nextProps.book.lastPage &&
    prevProps.book.lastReadTime === nextProps.book.lastReadTime &&
    prevProps.isGrid === nextProps.isGrid
  )
})

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  metaText: { fontSize: 11, color: '#555', fontWeight: '600' },
  metaTextTiny: { fontSize: 10, color: '#888' },
  metaHighlight: { fontSize: 12, color: '#333', fontWeight: '600' },
  metaDate: { fontSize: 11, color: '#888', marginLeft: 2 },

  rowIcon: { flexDirection: 'row', alignItems: 'center' },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },

  cardListContainer: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardGridContainer: {
    width: width / 2 - 25,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  cardListContent: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  cardGridContent: { padding: 10, alignItems: 'center' },

  iconBoxList: {
    width: 50,
    height: 65,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoList: { flex: 1, justifyContent: 'center', gap: 4 },
  titleList: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  rowMiddle: { flexDirection: 'row', alignItems: 'center' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },

  iconBoxGrid: {
    width: '60%',
    aspectRatio: 0.75,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoGrid: { width: '100%' },
  titleGrid: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 2,
    height: 36,
  },
  footerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 5,
  },
})
