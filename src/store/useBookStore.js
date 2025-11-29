import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useBookStore = create(
  persist(
    (set, get) => ({
      books: [],

      categories: [],

      addBook: (newBook) =>
        set((state) => {
          const exists = state.books.find((b) => b.uri === newBook.uri)
          if (exists) return state

          // Default kategori: 'Uncategorized' (Biar tidak error, tapi tidak muncul di tab)
          return {
            books: [{ ...newBook, category: 'Uncategorized' }, ...state.books],
          }
        }),

      addCategory: (newCategory) =>
        set((state) => {
          // Cegah duplikat & nama kosong
          if (!newCategory || state.categories.includes(newCategory))
            return state
          return { categories: [...state.categories, newCategory] }
        }),

      moveBookCategory: (bookId, newCategory) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId ? { ...b, category: newCategory } : b
          ),
        })),

      updateProgress: (bookId, page) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId
              ? { ...b, lastPage: page, lastReadTime: Date.now() }
              : b
          ),
        })),

      removeBook: (bookId) =>
        set((state) => ({
          books: state.books.filter((b) => b.id !== bookId),
        })),
    }),
    {
      name: 'book-reader-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
