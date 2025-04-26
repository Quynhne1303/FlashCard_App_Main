// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// ✅ Bổ sung các import dưới đây:
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBfeZbv0sWwRHdrVAbmEA4i6p-4D0hl03g",
  authDomain: "khang-a98ec.firebaseapp.com",
  projectId: "khang-a98ec",
  storageBucket: "khang-a98ec.appspot.com",
  messagingSenderId: "77513894336",
  appId: "1:77513894336:android:aa9146f84f72dcebf40025",
  databaseURL: "https://khang-a98ec-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

// ✅ Dùng initializeAuth thay vì getAuth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export { auth };
