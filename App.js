import React, { useState } from 'react'
import { StatusBar, View } from 'react-native'
import HomeScreen from './src/screens/HomeScreen'
import ReadingScreen from './src/screens/ReadingScreen'

export default function App() {
  // State: Menyimpan buku apa yang sedang dibuka
  // Kalau null = berarti sedang di Home (Rak Buku)
  // Kalau ada isinya = berarti sedang Baca Buku
  const [currentBook, setCurrentBook] = useState(null)

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />

      {currentBook ? (
        // --- LAYAR 2: MODE BACA ---
        <ReadingScreen
          book={currentBook}
          onClose={() => setCurrentBook(null)} // Kalau tombol 'Kembali' ditekan, set null lagi
        />
      ) : (
        // --- LAYAR 1: RAK BUKU ---
        <HomeScreen
          onOpenBook={(book) => setCurrentBook(book)} // Kalau buku diklik, simpan data bukunya
        />
      )}
    </View>
  )
}
