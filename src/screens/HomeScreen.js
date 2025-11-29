import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native'
import { useBookStore } from '../store/useBookStore'
import { pickAndSavePdf } from '../utils/fileHandler'
import BookCard from '../components/BookCard'

export default function HomeScreen({ onOpenBook }) {
  const {
    books,
    addBook,
    categories,
    addCategory,
    moveBookCategory,
    removeBook,
  } = useBookStore()

  const [isGridView, setIsGridView] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Semua')

  const [isAddCatVisible, setAddCatVisible] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const [isMoveVisible, setMoveVisible] = useState(false)
  const [selectedBookForAction, setSelectedBookForAction] = useState(null)

  // --- LOGIC ---
  const handleAddBook = async () => {
    const book = await pickAndSavePdf()
    if (book) {
      addBook(book)
      setSelectedTab('Semua')
    }
  }

  const handleCreateCategory = () => {
    if (newCatName.trim() === '') return
    addCategory(newCatName.trim())
    setNewCatName('')
    setAddCatVisible(false)
  }

  const onLongPressBook = (book) => {
    setSelectedBookForAction(book)
    setMoveVisible(true)
  }

  const executeMoveCategory = (category) => {
    if (selectedBookForAction) {
      moveBookCategory(selectedBookForAction.id, category)
      setMoveVisible(false)
      setSelectedBookForAction(null)
      Alert.alert('Berhasil', `Buku dipindah ke ${category}`)
    }
  }

  const executeDeleteBook = () => {
    if (selectedBookForAction) {
      Alert.alert(
        'Hapus Buku',
        `Yakin ingin menghapus "${selectedBookForAction.name}"?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: () => {
              removeBook(selectedBookForAction.id)
              setMoveVisible(false)
            },
          },
        ]
      )
    }
  }

  const getDisplayedBooks = () => {
    let result = [...books]
    if (selectedTab === 'Semua') return result.sort((a, b) => b.id - a.id)
    if (selectedTab === 'Terbaru')
      return result.sort((a, b) => b.lastReadTime - a.lastReadTime)
    return result.filter((book) => book.category === selectedTab)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Book Reader 📚</Text>
          <TouchableOpacity
            onPress={() => setIsGridView(!isGridView)}
            style={styles.viewBtn}
          >
            <Text style={{ fontSize: 24, color: '#333' }}>
              {isGridView ? '📜' : '田'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* NAVIGATION BAR */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.catScroll}
          >
            {/* Tab Statis */}
            <TouchableOpacity
              style={[
                styles.catTab,
                selectedTab === 'Semua' && styles.activeCatTab,
              ]}
              onPress={() => setSelectedTab('Semua')}
            >
              <Text
                style={[
                  styles.catText,
                  selectedTab === 'Semua' && styles.activeCatText,
                ]}
              >
                Semua
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.catTab,
                selectedTab === 'Terbaru' && styles.activeCatTab,
              ]}
              onPress={() => setSelectedTab('Terbaru')}
            >
              <Text
                style={[
                  styles.catText,
                  selectedTab === 'Terbaru' && styles.activeCatText,
                ]}
              >
                Terbaru
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: 1,
                height: 20,
                backgroundColor: '#ddd',
                marginHorizontal: 8,
                alignSelf: 'center',
              }}
            />

            {/* Tab User */}
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.catTab,
                  selectedTab === cat && styles.activeCatTab,
                ]}
                onPress={() => setSelectedTab(cat)}
              >
                <Text
                  style={[
                    styles.catText,
                    selectedTab === cat && styles.activeCatText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Tombol + */}
            <TouchableOpacity
              style={[
                styles.catTab,
                {
                  backgroundColor: 'white',
                  borderColor: '#007AFF',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                },
              ]}
              onPress={() => setAddCatVisible(true)}
            >
              <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
                + Kategori
              </Text>
            </TouchableOpacity>

            <View style={{ width: 20 }} />
          </ScrollView>
        </View>
      </View>

      {/* LIST BUKU */}
      <FlatList
        key={isGridView ? 'grid' : 'list'}
        data={getDisplayedBooks()}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 2 : 1}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            isGrid={isGridView}
            onPress={() => onOpenBook(item)}
            onLongPress={() => onLongPressBook(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ fontSize: 50 }}>📂</Text>
            <Text style={{ color: '#666', marginTop: 10, fontWeight: 'bold' }}>
              {selectedTab === 'Semua'
                ? 'Belum ada buku.'
                : selectedTab === 'Terbaru'
                ? 'Belum ada riwayat baca.'
                : `Kategori "${selectedTab}" kosong.`}
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddBook}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL 1: INPUT KATEGORI (FIXED TEXT COLOR) */}
      <Modal visible={isAddCatVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buat Kategori Baru</Text>

            <TextInput
              style={styles.input}
              placeholder='Misal: Komik, Jurnal...'
              placeholderTextColor='#999' // <-- Warna Placeholder Jelas
              value={newCatName}
              onChangeText={setNewCatName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setAddCatVisible(false)}
                style={styles.btnCancel}
              >
                <Text style={{ color: '#666' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateCategory}
                style={styles.btnSave}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: PINDAH KATEGORI */}
      <Modal visible={isMoveVisible} transparent animationType='slide'>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMoveVisible(false)}
        >
          <View style={styles.actionSheet}>
            <Text style={styles.sheetTitle}>
              Atur: {selectedBookForAction?.name}
            </Text>
            <Text style={styles.sheetSubtitle}>Pindahkan ke kategori:</Text>

            <View style={styles.chipContainer}>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => executeMoveCategory(cat)}
                  >
                    <Text style={styles.chipText}>{cat}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: '#999', fontStyle: 'italic' }}>
                  Belum ada kategori custom.
                </Text>
              )}
            </View>

            <View
              style={{ height: 1, backgroundColor: '#eee', marginVertical: 15 }}
            />

            <TouchableOpacity
              style={styles.btnDelete}
              onPress={executeDeleteBook}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                🗑 Hapus Buku
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // ... Styles Container & Header sama ...
  container: { flex: 1, backgroundColor: '#f5f5f5', position: 'relative' },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000' },
  viewBtn: { padding: 5 },

  catScroll: { paddingBottom: 5 },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCatTab: { backgroundColor: '#333' },
  catText: { color: '#666', fontWeight: '600' },
  activeCatText: { color: 'white', fontWeight: 'bold' },

  center: { alignItems: 'center', marginTop: 100 },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
  fabText: { color: 'white', fontSize: 32, marginTop: -4, fontWeight: 'bold' },

  // --- STYLE MODAL YANG DIPERBAIKI ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#000000', // <--- PAKSA HITAM BIAR KELIHATAN
    backgroundColor: '#fff', // <--- PAKSA BACKGROUND PUTIH
  },

  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  btnCancel: { padding: 10 },
  btnSave: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  actionSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  sheetSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipText: { color: '#333' },
  btnDelete: {
    backgroundColor: '#FF5252',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
})
