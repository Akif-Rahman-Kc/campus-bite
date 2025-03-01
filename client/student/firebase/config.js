import { initializeApp } from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyDYk7s_vRWFUWpe45Ai7qLuV8Clj4VyUfI",
    authDomain: "campus-bite-b1eb2.firebaseapp.com",
    projectId: "campus-bite-b1eb2",
    storageBucket: "campus-bite-b1eb2.appspot.com",
    messagingSenderId: "826083699352",
    appId: "1:826083699352:web:75672e6a2f208368c93eed",
    measurementId: "G-WMGNSSYHBY"
}

initializeApp(firebaseConfig)