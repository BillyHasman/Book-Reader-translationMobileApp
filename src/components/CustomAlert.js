import React from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

export default function CustomAlert({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = 'Ya, Hapus',
  isDanger = false,
}) {
  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View
            style={[
              styles.header,
              isDanger ? styles.headerDanger : styles.headerInfo,
            ]}
          >
            <MaterialIcons
              name={isDanger ? 'delete-outline' : 'info-outline'}
              size={32}
              color={isDanger ? '#D32F2F' : '#1976D2'}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
              <Text style={styles.textCancel}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnConfirm,
                isDanger ? styles.btnDanger : styles.btnPrimary,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.textConfirm}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },

  header: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerDanger: { backgroundColor: '#FFEBEE' },
  headerInfo: { backgroundColor: '#E3F2FD' },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },

  btnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  btnCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  btnConfirm: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },

  btnDanger: { backgroundColor: '#FF5252' },
  btnPrimary: { backgroundColor: '#007AFF' },

  textCancel: { color: '#666', fontWeight: 'bold' },
  textConfirm: { color: 'white', fontWeight: 'bold' },
})
