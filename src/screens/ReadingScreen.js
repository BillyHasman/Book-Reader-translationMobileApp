import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native'
import Pdf from 'react-native-pdf'
import TextRecognition from '@react-native-ml-kit/text-recognition'
import ViewShot from 'react-native-view-shot'
import { MaterialIcons } from '@expo/vector-icons'
import { useBookStore } from '../store/useBookStore'

const Translate = require('react-native-google-mlkit-translate').default
const { width } = Dimensions.get('window')
const isTablet = width > 700

export default function ReadingScreen({ book, onClose }) {
  const { updateProgress } = useBookStore()
  const viewShotRef = useRef()
  const [isSwipeMode, setIsSwipeMode] = useState(true)
  const [isPdfVisible, setIsPdfVisible] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStatus, setProcessStatus] = useState('')
  const [translatedPage, setTranslatedPage] = useState(null)
  const [isReaderMode, setIsReaderMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(book.lastPage || 1)

  const refreshPdf = (callback) => {
    setIsPdfVisible(false)
    setTimeout(() => {
      if (callback) callback()
      setIsPdfVisible(true)
    }, 100)
  }

  const toggleSwipeMode = () => {
    refreshPdf(() => setIsSwipeMode((prev) => !prev))
  }

  const cleanTextSmartly = (rawText) => {
    if (!rawText) return ''
    let text = rawText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)
    if (!sentences) return text
    let formattedText = ''
    sentences.forEach((sentence, index) => {
      formattedText += sentence.trim() + ' '
      if ((index + 1) % 4 === 0) formattedText += '\n\n'
    })
    return formattedText.trim()
  }

  const translateOnline = async (text) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=${encodeURIComponent(
        text
      )}`
      const response = await fetch(url)
      const data = await response.json()
      if (data && data[0]) return data[0].map((item) => item[0]).join('')
      return 'Gagal menerjemahkan teks.'
    } catch (error) {
      throw new Error('Gagal koneksi internet.')
    }
  }

  const handleMagicTranslate = async () => {
    setIsReaderMode(true)
    setIsProcessing(true)
    setTranslatedPage(null)
    try {
      setProcessStatus('📸 Memindai...')
      await new Promise((r) => setTimeout(r, 500))
      const uri = await viewShotRef.current.capture()
      setProcessStatus('👀 Membaca...')
      const recognitionResult = await TextRecognition.recognize(uri)
      const rawText = recognitionResult.text
      const cleanedText = cleanTextSmartly(rawText)
      if (!cleanedText || cleanedText.length < 5)
        throw new Error('Tulisan tidak terbaca.')
      setProcessStatus('🧠 Menerjemahkan...')
      const result = await translateOnline(cleanedText)
      setTranslatedPage(result)
    } catch (error) {
      setIsReaderMode(false)
      setTimeout(() => Alert.alert('Gagal', error.message), 500)
    } finally {
      setIsProcessing(false)
    }
  }

  if (book.type && book.type !== 'pdf') {
    return (
      <View style={styles.centerMsg}>
        <Text>Format tidak didukung.</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Kembali</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <MaterialIcons name='arrow-back' size={24} color='#007AFF' />
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Hal. {currentPage}</Text>
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.modeBtn}
            onPress={toggleSwipeMode}
            disabled={!isPdfVisible || isProcessing}
          >
            <MaterialIcons
              name={isSwipeMode ? 'view-carousel' : 'view-day'}
              size={20}
              color='#333'
              style={{ marginRight: 4 }}
            />
            <Text style={styles.modeBtnText}>
              {isSwipeMode ? 'Per Halaman' : 'Scroll Terus'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.translateBtn}
            onPress={handleMagicTranslate}
            disabled={isProcessing}
          >
            <MaterialIcons
              name='translate'
              size={20}
              color='white'
              style={{ marginRight: 4 }}
            />
            <Text style={styles.translateText}>Arti</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pdfContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'jpg', quality: 0.8 }}
          style={{ flex: 1 }}
        >
          {!isPdfVisible ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#007AFF' />
            </View>
          ) : (
            <Pdf
              key={`mode-${isSwipeMode}`}
              source={{ uri: book.uri, cache: true }}
              page={book.lastPage}
              onPageChanged={(page) => {
                setCurrentPage(page)
                updateProgress(book.id, page)
              }}
              onError={(error) => Alert.alert('Error', 'Gagal memuat PDF')}
              horizontal={isSwipeMode}
              enablePaging={true}
              spacing={0}
              fitPolicy={0}
              style={styles.pdf}
            />
          )}
        </ViewShot>
      </View>

      <Modal
        animationType='fade'
        visible={isReaderMode}
        onRequestClose={() => !isProcessing && setIsReaderMode(false)}
        transparent={true}
      >
        <View style={styles.popupOverlay}>
          <View style={[styles.popupCard, isTablet && styles.popupCardTablet]}>
            <View style={styles.popupHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                  name='translate'
                  size={20}
                  color='#007AFF'
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.readerTitle}>
                  Terjemahan Hal. {currentPage}
                </Text>
              </View>
              {!isProcessing && (
                <TouchableOpacity
                  onPress={() => setIsReaderMode(false)}
                  style={styles.btnClosePopup}
                >
                  <MaterialIcons name='close' size={20} color='#333' />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {isProcessing ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator size='large' color='#007AFF' />
                  <Text style={styles.loadingStateText}>{processStatus}</Text>
                </View>
              ) : (
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={true}
                >
                  <Text style={styles.readerText}>{translatedPage}</Text>
                  <View style={styles.paperFooter}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#999',
                        textAlign: 'center',
                      }}
                    >
                      --- Akhir Terjemahan ---
                    </Text>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 60,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  backBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 4,
  },
  pageTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modeBtnText: { color: '#333', fontWeight: '600', fontSize: 11 },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  translateText: { color: 'white', fontWeight: 'bold', fontSize: 11 },
  pdfContainer: { flex: 1, backgroundColor: '#e0e0e0' },
  pdf: { flex: 1, width: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerMsg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  btnBack: {
    backgroundColor: '#333',
    padding: 12,
    marginTop: 15,
    borderRadius: 8,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupCard: {
    width: '90%',
    height: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  popupCardTablet: { width: '60%', height: '90%' },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  readerTitle: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  btnClosePopup: { padding: 5 },
  scrollContent: { flexGrow: 1, padding: 25, paddingBottom: 50 },
  readerText: {
    fontSize: 18,
    lineHeight: 34,
    color: '#222',
    fontFamily: isTablet ? 'serif' : 'sans-serif',
    textAlign: 'justify',
    marginBottom: 20,
  },
  paperFooter: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  loadingState: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingStateText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
})
