# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "oda-blockskids")
4. Follow the setup wizard

## 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (you can change security rules later)
4. Select a location for your database

## 3. Enable Storage

1. In your Firebase project, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (you can change security rules later)

## 4. Get Your Firebase Config

1. In your Firebase project, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>)
4. Register your app with a nickname
5. Copy the config object

## 5. Update the Firebase Config

Replace the placeholder values in `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

## 6. Firestore Security Rules (Optional but Recommended)

For production, update your Firestore rules in the Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Storage Security Rules (Optional but Recommended)

For production, update your Storage rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 8. Test the Application

After setting up Firebase, run:

```bash
cd client
npm run dev
```

Navigate to `/admin` to test the CRUD interface for classes.