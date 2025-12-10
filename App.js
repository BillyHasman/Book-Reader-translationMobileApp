import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StatusBar, View, Animated, StyleSheet } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import HomeScreen from './src/screens/HomeScreen'
import ReadingScreen from './src/screens/ReadingScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import CategorySettingsScreen from './src/screens/CategorySettingsScreen'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [currentScreen, setCurrentScreen] = useState('home')
  const [currentBook, setCurrentBook] = useState(null)

  const popAnim = useRef(new Animated.Value(0.8)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()

      Animated.parallel([
        Animated.spring(popAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  const goHome = () => {
    setCurrentScreen('home')
    setCurrentBook(null)
  }
  const openBook = (book) => {
    setCurrentBook(book)
    setCurrentScreen('reading')
  }
  const openSettingsMenu = () => {
    setCurrentScreen('settings_menu')
  }
  const openCategoryManager = () => {
    setCurrentScreen('category_manager')
  }
  const backToSettingsMenu = () => {
    setCurrentScreen('settings_menu')
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: popAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <StatusBar barStyle='dark-content' backgroundColor='#ffffff' />

        {currentScreen === 'reading' && currentBook && (
          <ReadingScreen book={currentBook} onClose={goHome} />
        )}

        {currentScreen === 'settings_menu' && (
          <SettingsScreen
            onClose={goHome}
            onNavigateToCategory={openCategoryManager}
          />
        )}

        {currentScreen === 'category_manager' && (
          <CategorySettingsScreen onClose={backToSettingsMenu} />
        )}

        {currentScreen === 'home' && (
          <HomeScreen onOpenBook={openBook} onOpenSettings={openSettingsMenu} />
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
})
