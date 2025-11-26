# Health & Wellness - Exercise App

A React Native mobile application for browsing and discovering exercises using the API Ninjas Exercise API.

## Features

- 🏋️ Browse exercises by muscle groups
- 🎯 Filter by exercise type (cardio, strength, stretching, etc.)
- 📊 Filter by difficulty level (beginner, intermediate, expert)
- 🔍 Search exercises by name
- ❤️ Save favorite exercises
- 📱 Clean and intuitive UI
- 💾 Persistent favorites storage

## Setup Instructions

### Prerequisites

- Node.js installed
- Expo CLI installed (`npm install -g expo-cli`)
- API Ninjas API key (free at https://api-ninjas.com)

### Installation

1. Navigate to the project directory:
```bash
cd HealthWellnessApp
```

2. Install dependencies (already done):
```bash
npm install
```

3. Get your API key:
   - Go to https://api-ninjas.com
   - Sign up for a free account
   - Get your API key from the dashboard

4. Add your API key:
   - Open `src/services/api.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

5. Start the app:
```bash
npm start
```

6. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## Project Structure

```
HealthWellnessApp/
├── src/
│   ├── components/          # Reusable components
│   │   ├── CategoryCard.js
│   │   └── ExerciseCard.js
│   ├── constants/           # App constants
│   │   ├── theme.js        # Colors, fonts, sizes
│   │   └── data.js         # Static data
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/            # App screens
│   │   ├── HomeScreen.js
│   │   ├── ExerciseListScreen.js
│   │   ├── ExerciseDetailsScreen.js
│   │   └── FavoritesScreen.js
│   ├── services/           # API services
│   │   └── api.js
│   └── utils/              # Utility functions
│       └── storage.js      # AsyncStorage utils
├── App.js                  # Root component
└── package.json

```

## API Information

This app uses the Exercise API from API Ninjas:
- **Base URL**: https://api.api-ninjas.com/v1
- **Endpoint**: `/exercises`
- **Documentation**: https://api-ninjas.com/api/exercises

### Available Filters:
- `name`: Search by exercise name
- `muscle`: Filter by muscle group
- `type`: Filter by exercise type
- `difficulty`: Filter by difficulty level

## Screens

1. **Home Screen**: Browse categories and search exercises
2. **Exercise List Screen**: View filtered exercises
3. **Exercise Details Screen**: See detailed exercise information
4. **Favorites Screen**: View saved favorite exercises

## Technologies Used

- React Native
- Expo
- React Navigation
- Axios
- AsyncStorage

## Notes

- Make sure to add your API key before running the app
- The app requires an internet connection to fetch exercise data
- Favorites are stored locally on the device

## License

MIT
