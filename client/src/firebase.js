import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD678otM4Jn-H66ViPotwrtFiBxPs5XlPQ",
  authDomain: "taskmanagement-1af86.firebaseapp.com",
  projectId: "taskmanagement-1af86",
  storageBucket: "taskmanagement-1af86.firebasestorage.app",
  messagingSenderId: "266468955913",
  appId: "1:266468955913:web:b89483efadcdf22a2925d8",
  measurementId: "G-DHLHWKFZYG"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
