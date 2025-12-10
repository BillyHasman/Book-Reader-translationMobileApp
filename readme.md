# Book Reader App

A mobile book reader application designed for PDF documents with real-time page translation to Indonesian. Built with a clean, minimalist UI that prioritizes readability and smooth navigation.

## Features

1. **PDF Reader**  
   Open and read PDF books with swipe or scroll reading modes.

2. **Real-Time Page Translation**  
   Extracts text from each PDF page using OCR and translates it to Indonesian using on-device ML translation.

3. **Smart Library System**  
   Organize books by All Books, Recent Books, or custom categories.

4. **Local Storage**  
   Saves book metadata and categories locally for offline usage.

5. **File Import**  
   Add books from device storage using a simple file picker.

6. **Minimal UI**  
   Clean layout focused on smooth reading and distraction-free navigation.

## Technologies Used

- React Native  
- Expo  
- `react-native-pdf` for PDF rendering  
- `@react-native-ml-kit/text-recognition` for OCR  
- `react-native-google-mlkit-translate` for on-device translation  
- `react-native-view-shot` for capturing page snapshots  
- Zustand (`useBookStore`) for state management  
- Expo Document Picker & File System  

## Installation

1. Clone this repository  
2. Run `npm install`  
3. Start development server with `npx expo start`  
4. Open the app using Expo Go or a simulator

## How It Works

1. Select a PDF file to add it to your library  
2. Browse books under **All**, **Recent**, or **Custom Categories**  
3. Read using swipe or scroll mode  
4. Enable translation to convert each page into Indonesian  
5. OCR extracts text, then on-device ML handles translation  

## Notes

- All features work offline except initial file import  
- No API keys required. OCR and translation use on-device ML models  
- Project built for learning and portfolio purposes  
