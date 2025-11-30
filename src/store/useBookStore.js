import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useBookStore = create(
  persist(
    (set, get) => ({
      books: [],
      categories: [],

      // --- LOGIC UTAMA: ADD MULTIPLE ---
      addMultipleBooks: (newBooksArray, targetCategory = 'Uncategorized') => {
        const state = get()
        const existingBooks = state.books

        let addedCount = 0
        let duplicateCount = 0
        const validNewBooks = []

        if (!Array.isArray(newBooksArray)) return { added: 0, duplicates: 0 }

        newBooksArray.forEach((newBook) => {
          // Cek Duplikat (Berdasarkan Nama)
          const isDuplicate = existingBooks.some((b) => b.name === newBook.name)

          if (isDuplicate) {
            duplicateCount++
          } else {
            // Assign Kategori
            newBook.category = targetCategory
            validNewBooks.push(newBook)
            addedCount++
          }
        })

        if (addedCount > 0) {
          set({
            books: [...validNewBooks, ...state.books],
          })
        }

        return { added: addedCount, duplicates: duplicateCount }
      },

      // --- CRUD LAINNYA ---
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

      addCategory: (newCategory) =>
        set((state) => {
          if (!newCategory || state.categories.includes(newCategory))
            return state
          return { categories: [...state.categories, newCategory] }
        }),

      renameCategory: (oldName, newName) =>
        set((state) => {
          if (!newName || state.categories.includes(newName)) return state
          const newCategories = state.categories.map((c) =>
            c === oldName ? newName : c
          )
          const newBooks = state.books.map((b) =>
            b.category === oldName ? { ...b, category: newName } : b
          )
          return { categories: newCategories, books: newBooks }
        }),

      deleteCategory: (categoryName) =>
        set((state) => {
          const newCategories = state.categories.filter(
            (c) => c !== categoryName
          )
          const newBooks = state.books.map((b) =>
            b.category === categoryName
              ? { ...b, category: 'Uncategorized' }
              : b
          )
          return { categories: newCategories, books: newBooks }
        }),
    }),
    {
      name: 'book-reader-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
