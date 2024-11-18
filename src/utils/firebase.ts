// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { dataAlert, alertDataLists } from '../stores/interface/alert'
import dayjs from "dayjs";

const firebaseConfig: any = {
  apiKey: "AIzaSyDieoInHS9iTsAThBRvjlYtg0W8--jD23w",
  authDomain: "docarexartani.firebaseapp.com",
  projectId: "docarexartani",
  storageBucket: "docarexartani.appspot.com",
  messagingSenderId: "438286569970",
  appId: "1:438286569970:web:ea4651799ad7d36446db6b",
  measurementId: "G-ZG07968R3R"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
// Initialize Firebase

export {db }