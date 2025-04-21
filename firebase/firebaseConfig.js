import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAUsAwgXakyKIRxQrMWH0JgD3A66ugXZxE",
    authDomain: "app-fazenda-7177d.firebaseapp.com",
    projectId: "app-fazenda-7177d",
    storageBucket: "app-fazenda-7177d.firebasestorage.app",
    messagingSenderId: "1015528821359",
    appId: "1:1015528821359:web:bd63615a48fea98de3b39a",
    measurementId: "G-6HJ773KSJC"
  };

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
