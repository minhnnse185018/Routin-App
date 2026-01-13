# Routin - Habit Tracking App

A dark-themed mobile habit tracking app built with React Native and Expo Router.

## Features

- 🌑 Dark-themed mobile UI
- 🔐 Authentication screens (Login & Sign Up)
- 📱 iOS-style status bar with Dynamic Island
- 🎨 Brand colors: Lime green (#AEFF00) accent on dark backgrounds
- 🔄 Social login options (Google, Facebook, Apple)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- **iOS**: Press `i` in the terminal or scan the QR code with the Camera app
- **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
- **Web**: Press `w` in the terminal

## Project Structure

```
app/
├── (auth)/
│   ├── _layout.tsx       # Auth layout wrapper
│   ├── login.tsx         # Login screen (initial route)
│   └── signup.tsx        # Sign up screen
├── _layout.tsx           # Root layout
└── index.tsx             # Redirects to login
```

## Design System

### Colors

- **Background**: `#161616` (Dark gray)
- **Card Background**: `#000000` (Pure black)
- **Primary Accent**: `#AEFF00` (Lime green)
- **Border**: `#C3C3C3` (Light gray)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#727272` (Gray)

### Typography

- **Font Family**: SF Pro Display / SF Pro
- **Login Button**: 20px, Bold (700)
- **Social Buttons**: 16px, Semibold (600)
- **App Title**: 53px, Bold (700)
- **Tagline**: 27px, Bold (700)

### Components

- **Buttons**: Pill-shaped with 87.273px border radius
- **Input Fields**: Rounded with light borders
- **Cards**: 50px top border radius

## Initial Route

The app is configured to open directly to the login screen at `/(auth)/login`.

## Next Steps

To integrate authentication:

1. Set up OAuth providers (Google, Facebook, Apple)
2. Add form validation
3. Connect to a backend API
4. Implement secure token storage
5. Add protected routes for authenticated users

## License

MIT
