import React, { useState, useRef, useEffect } from 'react'
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
  NativeModules, // <--- KITA PANGGIL DAFTAR MESIN
} from 'react-native'
import Pdf from 'react-native-pdf'

// Coba import cara normal dulu
import Translate from 'react-native-google-mlkit-translate'

import TextRecognition from '@react-native-ml-kit/text-recognition'
import ViewShot from 'react-native-view-shot'
import { useBookStore } from '../store/useBookStore'

export default function ReadingScreen({ book, onClose }) {
  const { updateProgress } = useBookStore()
  const viewShotRef = useRef()

  const [isSwipeMode, setIsSwipeMode] = useState(true)
  const [isPdfVisible, setIsPdfVisible] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStatus, setProcessStatus] = useState('')
  const [translatedPage, setTranslatedPage] = useState(null)
  const [isReaderMode, setIsReaderMode] = useState(false)

  // --- DIAGNOSTIK SAAT APLIKASI DIBUKA ---
  useEffect(() => {
    console.log('=== MEMULAI DIAGNOSA NATIVE MODULES ===')

    // 1. Cek isi NativeModules
    const moduleNames = Object.keys(NativeModules)
    console.log('Total Module Terinstall:', moduleNames.length)

    // 2. Cari yang namanya mirip "Translate"
    const translateModules = moduleNames.filter(
      (name) =>
        name.toLowerCase().includes('translate') ||
        name.toLowerCase().includes('mlkit')
    )

    console.log('🔎 Module Translate Ditemukan:', translateModules)

    // 3. Cek Object Translate yang kita import
    console.log('📦 Isi Library Import:', Translate)
  }, [])

  const toggleMode = () => {
    setIsPdfVisible(false)
    setTimeout(() => {
      setIsSwipeMode((prev) => !prev)
      setIsPdfVisible(true)
    }, 100)
  }

  const handleMagicTranslate = async () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      // 1. FOTO
      setProcessStatus('📸 Memindai halaman...')
      const uri = await viewShotRef.current.capture()

      // 2. BACA (OCR)
      setProcessStatus('👀 Membaca tulisan...')
      const recognitionResult = await TextRecognition.recognize(uri)
      const extractedText = recognitionResult.text

      console.log('✅ OCR Sukses. Panjang Teks:', extractedText.length)

      if (!extractedText || extractedText.trim().length < 5) {
        throw new Error('Teks terlalu sedikit. Coba halaman lain.')
      }

      // 3. TRANSLATE (DENGAN LOGGING EKSTRA)
      setProcessStatus('🧠 Menerjemahkan...')

      console.log('🚀 Mencoba memanggil Translate...')

      try {
        // Coba panggil langsung
        const result = await Translate.translate(extractedText, 'id')
        console.log('✅ Translate BERHASIL:', result.substring(0, 20) + '...')

        setTranslatedPage(result)
        setIsReaderMode(true)
      } catch (innerError) {
        console.log('❌ Gagal Panggilan Pertama:', innerError)

        // PLAN B: Cek Download
        console.log('🔄 Mencoba cek download model...')
        const isDownloaded = await Translate.isModelDownloaded('id')
        console.log("Status Model 'id':", isDownloaded)

        if (!isDownloaded) {
          await Translate.downloadModel('id')
          const retryResult = await Translate.translate(extractedText, 'id')
          setTranslatedPage(retryResult)
          setIsReaderMode(true)
        }
      }
    } catch (error) {
      console.log('❌ ERROR FINAL:', error)

      // Tampilkan error ke layar user biar kelihatan jelas
      Alert.alert(
        'Diagnosa Error',
        'OCR: ' +
          (processStatus.includes('Membaca') ? 'Sukses' : 'Gagal') +
          '\n' +
          'Translate: ' +
          error.message
      )
    } finally {
      setIsProcessing(false)
      setProcessStatus('')
    }
  }

  // ... (Sisa kode UI sama persis, copy paste dari sebelumnya kalau hilang) ...
  if (book.type && book.type !== 'pdf') {
    return (
      <View style={styles.centerMsg}>
        <Text>Format tidak didukung.</Text>
        <TouchableOpacity onPress={onClose} style={styles.btnBack}>
          <Text style={{ color: 'white' }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='white' />
          <Text style={styles.loadingText}>{processStatus}</Text>
        </View>
      )}

      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={{ flex: 1 }}
      >
        {!isPdfVisible ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#007AFF' />
          </View>
        ) : (
          <Pdf
            key={isSwipeMode ? 'swipe-mode' : 'scroll-mode'}
            source={{ uri: book.uri, cache: true }}
            page={book.lastPage}
            onPageChanged={(page) => updateProgress(book.id, page)}
            onError={(error) => Alert.alert('Error', 'Gagal memuat PDF')}
            horizontal={isSwipeMode}
            enablePaging={true}
            spacing={0}
            fitPolicy={0}
            style={styles.pdf}
          />
        )}
      </ViewShot>

      {!isReaderMode && (
        <View style={styles.controlsWrapper}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.btnSmall} onPress={onClose}>
              <Text style={styles.btnText}>Kembali</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: '#FF9800' }]}
              onPress={toggleMode}
              disabled={!isPdfVisible || isProcessing}
            >
              <Text style={styles.btnText}>
                {isSwipeMode ? '↕ Vertikal' : '↔ Horizontal'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: '#007AFF' }]}
              onPress={handleMagicTranslate}
              disabled={isProcessing}
            >
              <Text style={styles.btnText}>🌐 Arti</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        animationType='fade'
        visible={isReaderMode}
        onRequestClose={() => setIsReaderMode(false)}
      >
        <View style={styles.readerContainer}>
          <StatusBar barStyle='dark-content' backgroundColor='white' />
          <View style={styles.readerHeader}>
            <Text style={styles.readerTitle}>
              Terjemahan Halaman {book.lastPage}
            </Text>
            <TouchableOpacity
              onPress={() => setIsReaderMode(false)}
              style={styles.btnCloseReader}
            >
              <Text style={{ fontSize: 20, color: '#333' }}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.readerContent}>
            <Text style={styles.readerText}>{translatedPage}</Text>
            <View style={{ height: 50 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0e0e0' },
  pdf: { flex: 1, width: Dimensions.get('window').width },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
  },
  controls: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  btnSmall: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  btnAction: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  centerMsg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnBack: {
    backgroundColor: '#333',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  readerContainer: { flex: 1, backgroundColor: '#ffffff' },
  readerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  readerTitle: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  btnCloseReader: { padding: 5 },
  readerContent: { flex: 1, padding: 25 },
  readerText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#222',
    fontFamily: 'serif',
    textAlign: 'left',
  },
})
