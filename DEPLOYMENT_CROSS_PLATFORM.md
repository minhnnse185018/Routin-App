# Deployment Guide - React Native + React Native Web

Project nay da dung Expo Router, nen co the build tu cung 1 codebase cho:

- Mobile Android/iOS (native app)
- Web (React Native Web static output)

## 1. Local run

- Mobile + QR dev server: npm run start
- Android emulator/device: npm run android
- iOS simulator/device: npm run ios
- Web: npm run web

## 2. Build web de deploy

Lenh build static web:

- npm run build:web

Sau khi build, thu muc output mac dinh la dist.

Ban co the deploy dist len:

- Vercel
- Netlify
- Cloudflare Pages
- Firebase Hosting

Quan trong:

- API backend phai mo CORS cho domain web deploy.
- Neu can base URL rieng cho web, can cap nhat extra.apiBaseUrl trong app.json hoac tach env theo moi truong.

## 3. Build mobile voi EAS

Buoc 1: Cai va login EAS

- npm install -g eas-cli
- eas login

Buoc 2: Cau hinh project build cloud

- eas build:configure

Buoc 3: Build production

- Android: npm run build:android
- iOS: npm run build:ios
- Ca hai: npm run build:mobile

## 4. Submit store (sau khi build)

- Android (Play Console): eas submit --platform android --profile production
- iOS (App Store Connect): eas submit --platform ios --profile production

## 5. Notes cho 1 codebase mobile + web

1. Tranh dung API native-only tren web ma khong co fallback.
2. Dung Platform.select cho khac biet UI nho.
3. Tranh dung style khong tuong thich web (vd shadow qua dac thu) neu khong test browser.
4. Kiem tra deep link scheme routin cho mobile va URL route cho web.
5. Kiem thu breakpoint mobile/tablet/desktop truoc khi release web.

## 6. Checklist truoc release

1. Login, refresh token, logout hoat dong tren ca mobile va web.
2. Upload media test tren mobile va web.
3. Chat realtime test reconnect scenario.
4. CORS backend da whitelist domain web production.
5. Build production khong loi tren ca Android va iOS.
