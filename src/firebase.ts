// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfgHUaCLpoMVyZxG4nOp0beJXfDGaPqrc",
  authDomain: "test-32c68.firebaseapp.com",
  databaseURL:
    "https://test-32c68-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-32c68",
  storageBucket: "test-32c68.appspot.com",
  messagingSenderId: "923230381348",
  appId: "1:923230381348:web:4c290a6a4c186350ea3fb1",
  measurementId: "G-F2CHB4XQ6Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };
