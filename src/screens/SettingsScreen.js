import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

export default function SettingsScreen({ onClose, onNavigateToCategory }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.btnBack}>
          <MaterialIcons name='arrow-back' size={24} color='#007AFF' />
          <Text style={styles.btnBackText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pengaturan</Text>
        <View style={{ width: 80 }} />
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.menuLabel}>UMUM</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={onNavigateToCategory}
        >
          <View style={styles.iconBox}>
            <MaterialIcons name='folder' size={28} color='#1976D2' />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Kelola Kategori</Text>
            <Text style={styles.menuSub}>
              Tambah, ubah, atau hapus kategori
            </Text>
          </View>
          <MaterialIcons name='chevron-right' size={24} color='#CCC' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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
  menuContainer: { padding: 20 },
  menuLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  menuSub: { fontSize: 12, color: '#888' },
})
