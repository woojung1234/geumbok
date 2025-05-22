# Finance Assistant

A React Native Expo app with expo-router for financial assistance.

## Installation

1. Clone the repository
```bash
git clone https://github.com/woojung1234/geumbok.git
cd geumbok
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npx expo start
```

## Fixed Issues

- Updated dependencies to compatible versions
- Fixed React Native version conflicts
- Added proper voice recognition plugin configuration
- Added network security config for Android
- Updated app structure to use expo-router properly
- Added RecoilRoot and SafeAreaProvider to root layout

## Important Notes

- The App.js file has been replaced with expo-router structure
- Main entry point is now app/_layout.tsx
- Make sure to run `npm install` after pulling changes
- For Android development, ensure you have the proper SDK installed

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
