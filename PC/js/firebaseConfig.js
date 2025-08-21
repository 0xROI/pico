// firebaseConfig.js
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDqEF4fcLnoiGpZX8ajhoFWkuymrcUxFXw",
  authDomain: "testing-ceef7.firebaseapp.com",
  databaseURL: "https://testing-ceef7-default-rtdb.firebaseio.com",
  projectId: "testing-ceef7",
  storageBucket: "testing-ceef7.firebasestorage.app",
  messagingSenderId: "456031852196",
  appId: "1:456031852196:web:f7f46da61a797de7bdf831"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
const database = getDatabase(app);

export { auth, database };

export { firebaseConfig };