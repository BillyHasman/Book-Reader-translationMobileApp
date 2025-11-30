import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useBookStore } from '../store/useBookStore'
import CustomAlert from '../components/CustomAlert'

export default function CategorySettingsScreen({ onClose }) {
  const { categories, addCategory, renameCategory, deleteCategory } =
    useBookStore()
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    msg: '',
    type: 'info',
    onConfirm: () => {},
  })
  const [isInputModalVisible, setInputModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [mode, setMode] = useState('add')
  const [targetCat, setTargetCat] = useState(null)

  const showAlert = (title, msg, type, onConfirm) =>
    setAlertConfig({ visible: true, title, msg, type, onConfirm })
  const closeAlert = () => setAlertConfig({ ...alertConfig, visible: false })

  const handleAddClick = () => {
    setMode('add')
    setInputText('')
    setInputModalVisible(true)
  }
  const handleEditClick = (catName) => {
    setMode('edit')
    setTargetCat(catName)
    setInputText(catName)
    setInputModalVisible(true)
  }
  const handleSave = () => {
    const cleanText = inputText.trim()
    if (cleanText !== '') {
      if (mode === 'add') addCategory(cleanText)
      else renameCategory(targetCat, cleanText)
    }
    setInputModalVisible(false)
  }
  const handleDeleteClick = (catName) => {
    showAlert(
      'Hapus Kategori?',
      `Kategori "${catName}" akan dihapus.`,
      'danger',
      () => {
        deleteCategory(catName)
        closeAlert()
      }
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.btnBack}>
          <MaterialIcons name='arrow-back' size={24} color='#007AFF' />
          <Text style={styles.btnBackText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kelola Kategori</Text>
        <TouchableOpacity onPress={handleAddClick} style={styles.btnAddHeader}>
          <MaterialIcons name='add' size={28} color='#007AFF' />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          Total: {categories.length} Kategori
        </Text>
        {categories.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name='folder-open' size={50} color='#ddd' />
            <Text style={{ color: '#999', marginTop: 10 }}>
              Belum ada kategori.
            </Text>
          </View>
        ) : (
          categories.map((cat, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.catName}>{cat}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleEditClick(cat)}
                  style={[styles.btnIcon, styles.btnEdit]}
                >
                  <MaterialIcons name='edit' size={20} color='#555' />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteClick(cat)}
                  style={[styles.btnIcon, styles.btnDelete]}
                >
                  <MaterialIcons name='delete' size={20} color='#D32F2F' />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Modal visible={isInputModalVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Tambah Kategori' : 'Ganti Nama'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Nama Kategori...'
              placeholderTextColor='#999'
              value={inputText}
              onChangeText={setInputText}
              autoFocus
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setInputModalVisible(false)}
                style={styles.btnCancel}
              >
                <Text style={{ color: '#666' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.btnSave}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.msg}
        isDanger={alertConfig.type === 'danger'}
        confirmText='Ya, Hapus'
        onCancel={closeAlert}
        onConfirm={alertConfig.onConfirm}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
  },
  btnBack: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  btnBackText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  btnAddHeader: { padding: 5 },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 1,
  },
  catName: { fontSize: 16, color: '#333', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 10 },
  btnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEdit: { backgroundColor: '#F0F0F0' },
  btnDelete: { backgroundColor: '#FFF0F0' },
  emptyBox: { alignItems: 'center', marginTop: 50 },
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
    color: '#000',
  },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  btnCancel: { padding: 10 },
  btnSave: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
})
