import React, { useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useBookStore } from '../store/useBookStore'
import { pickAndSavePdf } from '../utils/fileHandler'
import BookCard from '../components/BookCard'
import CustomAlert from '../components/CustomAlert'

const { width } = Dimensions.get('window')
const isTablet = width > 700

export default function HomeScreen({ onOpenBook, onOpenSettings }) {
  const {
    books,
    addMultipleBooks,
    categories,
    addCategory,
    moveBookCategory,
    removeBook,
  } = useBookStore()

  const [isGridView, setIsGridView] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Semua')
  const [isPickerVisible, setPickerVisible] = useState(false)
  const [isAddCatVisible, setAddCatVisible] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [isMoveVisible, setMoveVisible] = useState(false)
  const [selectedBookForAction, setSelectedBookForAction] = useState(null)
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    msg: '',
    type: 'info',
    onConfirm: () => {},
  })

  const showAlert = useCallback(
    (title, msg, type, onConfirm, confirmText = 'Ok') => {
      setAlertConfig({
        visible: true,
        title,
        msg,
        type,
        onConfirm,
        confirmText,
      })
    },
    []
  )

  const closeAlert = useCallback(
    () => setAlertConfig({ ...alertConfig, visible: false }),
    [alertConfig]
  )

  const handleAddBook = async () => {
    const newBooksArray = await pickAndSavePdf()
    if (!newBooksArray || newBooksArray.length === 0) return

    let targetCategory = 'Uncategorized'
    if (selectedTab !== 'Semua' && selectedTab !== 'Terbaru') {
      targetCategory = selectedTab
    }

    const result = addMultipleBooks(newBooksArray, targetCategory)

    if (result.added > 0 && result.duplicates === 0) {
      showAlert(
        'Sukses',
        `Berhasil menambahkan ${result.added} buku.`,
        'info',
        closeAlert
      )
    } else if (result.added > 0 && result.duplicates > 0) {
      showAlert(
        'Selesai',
        `${result.added} buku masuk.\n${result.duplicates} duplikat dilewati.`,
        'info',
        closeAlert
      )
    } else if (result.added === 0 && result.duplicates > 0) {
      showAlert('Info', `Semua buku sudah ada.`, 'danger', closeAlert, 'Tutup')
    }
  }

  const handleCreateCategory = () => {
    if (newCatName.trim() === '') return
    addCategory(newCatName.trim())
    setSelectedTab(newCatName.trim())
    setNewCatName('')
    setAddCatVisible(false)
  }

  const onLongPressBook = useCallback((book) => {
    setSelectedBookForAction(book)
    setMoveVisible(true)
  }, [])

  const executeMoveCategory = (category) => {
    if (selectedBookForAction) {
      moveBookCategory(selectedBookForAction.id, category)
      setMoveVisible(false)
      setSelectedBookForAction(null)
    }
  }

  const executeDeleteBook = () => {
    if (selectedBookForAction) {
      setMoveVisible(false)
      setTimeout(() => {
        showAlert(
          'Hapus Buku?',
          `Hapus "${selectedBookForAction.name}"?`,
          'danger',
          () => {
            removeBook(selectedBookForAction.id)
            closeAlert()
          },
          'Ya, Hapus'
        )
      }, 300)
    }
  }

  const displayedBooks = useMemo(() => {
    let result = [...books]
    if (selectedTab === 'Semua') return result.sort((a, b) => b.id - a.id)
    if (selectedTab === 'Terbaru')
      return result.sort((a, b) => b.lastReadTime - a.lastReadTime)
    return result.filter((book) => book.category === selectedTab)
  }, [books, selectedTab])

  const isCustomCategory = selectedTab !== 'Semua' && selectedTab !== 'Terbaru'
  const categoryBtnLabel = isCustomCategory ? selectedTab : 'Kategori'

  const renderItem = useCallback(
    ({ item }) => (
      <BookCard
        book={item}
        isGrid={isGridView}
        onPress={() => onOpenBook(item)}
        onLongPress={() => onLongPressBook(item)}
      />
    ),
    [isGridView, onOpenBook, onLongPressBook]
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons
              name='menu-book'
              size={28}
              color='#007AFF'
              style={{ marginRight: 10 }}
            />
            <Text style={styles.title}>Book Reader</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
              <MaterialIcons
                name={isGridView ? 'view-list' : 'grid-view'}
                size={28}
                color='#333'
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onOpenSettings}>
              <MaterialIcons name='settings' size={28} color='#333' />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navBar}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              selectedTab === 'Semua' && styles.activeNavBtn,
            ]}
            onPress={() => setSelectedTab('Semua')}
          >
            <Text
              style={[
                styles.navText,
                selectedTab === 'Semua' && styles.activeNavText,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              selectedTab === 'Terbaru' && styles.activeNavBtn,
            ]}
            onPress={() => setSelectedTab('Terbaru')}
          >
            <Text
              style={[
                styles.navText,
                selectedTab === 'Terbaru' && styles.activeNavText,
              ]}
            >
              Terbaru
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, isCustomCategory && styles.activeNavBtn]}
            onPress={() => setPickerVisible(true)}
          >
            <MaterialIcons
              name='folder'
              size={16}
              color={isCustomCategory ? 'white' : '#666'}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[styles.navText, isCustomCategory && styles.activeNavText]}
              numberOfLines={1}
            >
              {categoryBtnLabel}
            </Text>
            <MaterialIcons
              name='arrow-drop-down'
              size={16}
              color={isCustomCategory ? 'white' : '#666'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() => setAddCatVisible(true)}
          >
            <MaterialIcons name='add' size={24} color='#007AFF' />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        key={isGridView ? 'grid' : 'list'}
        data={displayedBooks}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 2 : 1}
        renderItem={renderItem}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <View style={styles.center}>
            <MaterialIcons name='folder-open' size={60} color='#ddd' />
            <Text style={{ color: '#666', marginTop: 10, fontWeight: 'bold' }}>
              {selectedTab === 'Semua' ? 'Belum ada buku.' : `Kategori kosong.`}
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
      />

      <TouchableOpacity
        style={[styles.fab, isTablet && styles.fabTablet]}
        onPress={handleAddBook}
        activeOpacity={0.8}
      >
        <MaterialIcons name='add' size={32} color='white' />
      </TouchableOpacity>

      <Modal visible={isPickerVisible} transparent animationType='fade'>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setPickerVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            <View
              style={{ height: 1, backgroundColor: '#eee', marginBottom: 10 }}
            />
            <ScrollView style={{ maxHeight: 300 }}>
              {categories.length === 0 ? (
                <Text
                  style={{ color: '#999', textAlign: 'center', padding: 20 }}
                >
                  Belum ada kategori.
                </Text>
              ) : (
                categories.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedTab(cat)
                      setPickerVisible(false)
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <MaterialIcons
                        name='folder'
                        size={20}
                        color='#555'
                        style={{ marginRight: 10 }}
                      />
                      <Text style={{ fontSize: 16, color: '#333' }}>{cat}</Text>
                    </View>
                    {selectedTab === cat && (
                      <MaterialIcons name='check' size={20} color='#007AFF' />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.msg}
        isDanger={alertConfig.type === 'danger'}
        confirmText={alertConfig.confirmText}
        onCancel={closeAlert}
        onConfirm={alertConfig.onConfirm}
      />

      <Modal visible={isAddCatVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kategori Baru</Text>
            <TextInput
              style={styles.input}
              placeholder='Nama kategori...'
              placeholderTextColor='#999'
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
                <Text style={{ color: 'white' }}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isMoveVisible} transparent animationType='fade'>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMoveVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.actionSheet}>
            <Text style={styles.sheetTitle}>Atur Buku</Text>
            <Text style={styles.sheetSubtitle}>
              {selectedBookForAction?.name}
            </Text>

            <Text
              style={{
                color: '#888',
                fontSize: 12,
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              PINDAHKAN KE:
            </Text>
            <View style={styles.chipContainer}>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.chip}
                  onPress={() => executeMoveCategory(cat)}
                >
                  <Text style={styles.chipText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{ height: 1, backgroundColor: '#eee', marginVertical: 15 }}
            />
            <TouchableOpacity
              style={styles.btnDelete}
              onPress={executeDeleteBook}
            >
              <MaterialIcons
                name='delete'
                size={20}
                color='white'
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Hapus Buku
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#000000' },
  navBar: { flexDirection: 'row', gap: 8 },
  navBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeNavBtn: { backgroundColor: '#333' },
  navText: { color: '#666', fontWeight: '600', fontSize: 12 },
  activeNavText: { color: 'white', fontWeight: 'bold' },
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
  fabTablet: { bottom: 90, right: 50, width: 70, height: 70, borderRadius: 35 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#000',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
