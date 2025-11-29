import * as DocumentPicker from 'expo-document-picker'
// PERBAIKAN: Kita tambah '/legacy' sesuai saran error log
import * as FileSystem from 'expo-file-system/legacy'

export const pickAndSavePdf = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    })

    if (result.canceled) return null

    const file = result.assets[0]
    const timestamp = Date.now()
    // Bersihkan nama file
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')

    // Gunakan documentDirectory dari FileSystem (legacy tetap punya ini)
    const newPath = `${FileSystem.documentDirectory}${timestamp}_${cleanName}`

    // Fungsi copyAsync ini yang tadi bikin error, sekarang aman pakai legacy
    await FileSystem.copyAsync({
      from: file.uri,
      to: newPath,
    })

    return {
      id: timestamp.toString(),
      name: file.name.replace('.pdf', ''),
      uri: newPath,
      totalPage: 0,
      lastPage: 1,
      lastReadTime: Date.now(),
    }
  } catch (error) {
    console.error(error)
    alert('Gagal mengambil file PDF: ' + error.message)
    return null
  }
}
