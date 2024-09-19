// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app) 
export {auth}