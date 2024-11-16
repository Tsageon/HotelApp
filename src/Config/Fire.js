// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVkY9nF8Oo8Izpfgcw7rPI0Ysu9OX3rGY",
  authDomain: "hotel-1d87c.firebaseapp.com",
  projectId: "hotel-1d87c",
  storageBucket: "hotel-1d87c.appspot.com",
  messagingSenderId: "866465150184",
  appId: "1:866465150184:web:9342c4ea97348aa328855d",
  measurementId: "G-T9VHQ3N971"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};