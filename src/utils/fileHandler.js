import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'

export const pickAndSavePdf = async () => {
  try {
    // console.log('Membuka Document Picker...')
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // Izinkan semua, nanti kita filter manual
      copyToCacheDirectory: true,
      multiple: true, // FITUR MULTIPLE SELECT
    })

    if (result.canceled) {
      // console.log('User membatalkan pemilihan.')
      return []
    }

    const processedBooks = []

    for (const file of result.assets) {
      const fileName = file.name

      let fileType = 'unknown'
      if (fileName.toLowerCase().endsWith('.pdf')) fileType = 'pdf'
      else if (fileName.toLowerCase().endsWith('.epub')) fileType = 'epub'
      else if (fileName.toLowerCase().endsWith('.lit')) fileType = 'lit'
      else {
        // console.log(`File dilewati (format salah): ${fileName}`)
        continue
      }

      const timestamp = Date.now()
      const uniqueId = timestamp.toString() + Math.floor(Math.random() * 10000)
      const cleanName = fileName.replace(/[^a-zA-Z0-9.]/g, '_')
      const newPath = `${FileSystem.documentDirectory}${uniqueId}_${cleanName}`

      try {
        await FileSystem.copyAsync({
          from: file.uri,
          to: newPath,
        })

        processedBooks.push({
          id: uniqueId,
          name: fileName.replace(/\.(pdf|epub|lit)$/i, ''),
          uri: newPath,
          type: fileType,
          totalPage: 0,
          lastPage: 1,
          lastReadTime: Date.now(),
          category: 'Uncategorized',
        })
      } catch (copyError) {
        console.error('Gagal copy file:', copyError)
      }
    }

    return processedBooks
  } catch (error) {
    console.error('Error Picker:', error)
    alert('Gagal mengambil file: ' + error.message)
    return []
  }
}
