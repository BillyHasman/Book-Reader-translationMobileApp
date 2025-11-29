# SimpleBookReader

A minimalist offline book reader application focused on PDF documents with clean UI and simple navigation.

## Style Guide

Clean, minimalist design with ample whitespace and a calming color palette. The interface prioritizes readability and ease of use with a focus on content consumption rather than complex features.

## Theme and Color Scheme

- Primary Color: #2ecc71 (Green - for primary actions)
- Secondary Color: #1abc9c (Teal - for secondary elements)
- Accent Color: #3498db (Blue - for highlights and links)
- Background: #f9f9f9 (Light gray - main background)
- Surface: #ffffff (White - cards and containers)
- Text: #2c3e50 (Dark gray - primary text)
- Text Secondary: #7f8c8d (Gray - secondary text)
- Border Radius: rounded-lg
- Padding: p-6
- Margin: m-4

## Features

1. **Book Library**: Displays all added books in a clean grid view
2. **File Picker**: Add books from device storage (PDF focus)
3. **Offline Reading**: All books stored locally on device
4. **Minimal Reader**: Simple swipe navigation for PDFs
5. **Local Storage**: Saves book metadata using AsyncStorage
6. **Empty State**: Elegant empty library view when no books are added

## Technologies Used

- React Native
- Expo
- NativeWind (Tailwind CSS for React Native)
- AsyncStorage for local storage
- Expo Document Picker for file selection
- Lucide Icons for UI icons

## Installation Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npx expo start` to start the development server
4. Use Expo Go app to preview on device or run on simulator

## Usage Instructions

1. Tap "Add Book" to select a PDF file from your device
2. Your books will appear in the library
3. Tap any book to open the reader
4. Swipe left/right to navigate pages
5. Use the page indicator to jump to specific pages

```

```
