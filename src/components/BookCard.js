import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

const { width } = Dimensions.get('window')

export default function BookCard({ book, onPress, onLongPress, isGrid }) {
  // Format Tanggal: "28 Nov, 14:30"
  const dateStr = new Date(book.lastReadTime).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  // Tampilan Badge Kategori (Bisa dipakai di List & Grid)
  const CategoryBadge = () => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{book.category || 'Umum'}</Text>
    </View>
  )

  // --- MODE GRID (KOTAK) ---
  if (isGrid) {
    return (
      <TouchableOpacity
        style={styles.cardGrid}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={500}
      >
        <View style={styles.iconBoxGrid}>
          <Text style={styles.iconTextGrid}>PDF</Text>
        </View>

        <View style={styles.infoGrid}>
          {/* Judul */}
          <Text style={styles.titleGrid} numberOfLines={2}>
            {book.name}
          </Text>

          {/* Kategori (Tengah) */}
          <View style={{ alignItems: 'center', marginVertical: 4 }}>
            <CategoryBadge />
          </View>

          {/* Footer: Halaman & Jam (Kiri-Kanan) */}
          <View style={styles.footerGrid}>
            <Text style={styles.metaText}>📖 {book.lastPage}</Text>
            <Text style={styles.metaTextTiny}>
              🕒 {dateStr.split(',')[1] || dateStr}
            </Text>
            {/* Di grid ambil jamnya aja biar muat, atau tanggal pendek */}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // --- MODE LIST (BARIS) ---
  return (
    <TouchableOpacity
      style={styles.cardList}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      {/* Icon Kiri */}
      <View style={styles.iconBoxList}>
        <Text style={styles.iconTextList}>PDF</Text>
      </View>

      {/* Info Kanan */}
      <View style={styles.infoList}>
        {/* Baris 1: Judul */}
        <Text style={styles.titleList} numberOfLines={1}>
          {book.name}
        </Text>

        {/* Baris 2: Kategori & Halaman */}
        <View style={styles.rowMiddle}>
          <CategoryBadge />
          <View style={styles.dotSeparator} />
          <Text style={styles.metaHighlight}>📖 Hal. {book.lastPage}</Text>
        </View>

        {/* Baris 3: Tanggal & Jam */}
        <View style={styles.rowBottom}>
          <Text style={styles.metaDate}>🕒 {dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  // --- BADGE KATEGORI ---
  badgeContainer: {
    backgroundColor: '#E3F2FD', // Biru muda lembut
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

  // --- STYLES UMUM ---
  metaText: { fontSize: 11, color: '#555', fontWeight: '600' },
  metaTextTiny: { fontSize: 10, color: '#888' },
  metaHighlight: { fontSize: 12, color: '#333', fontWeight: '600' },
  metaDate: { fontSize: 11, color: '#888' },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },

  // --- LIST VIEW ---
  cardList: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconBoxList: {
    width: 50,
    height: 65,
    backgroundColor: '#FF5252',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconTextList: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  infoList: { flex: 1, justifyContent: 'center', gap: 4 }, // gap biar rapi
  titleList: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  rowMiddle: { flexDirection: 'row', alignItems: 'center' },
  rowBottom: { marginTop: 2 },

  // --- GRID VIEW ---
  cardGrid: {
    backgroundColor: 'white',
    width: width / 2 - 25,
    margin: 5,
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconBoxGrid: {
    width: '60%',
    aspectRatio: 0.75,
    backgroundColor: '#FF5252',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconTextGrid: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  infoGrid: { width: '100%' },
  titleGrid: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 2,
    height: 36,
  }, // Fixed height biar rapi
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
