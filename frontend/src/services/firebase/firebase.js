import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCR_-VIJe_wgXD1XhCuMYnYSl_hufllfcw",
    authDomain: "movie-ticket-booking-25118.firebaseapp.com",
    projectId: "movie-ticket-booking-25118",
    storageBucket: "movie-ticket-booking-25118.appspot.com",
    messagingSenderId: "73030165688",
    appId: "1:73030165688:web:e333fc9101428c53c4804d",
    measurementId: "G-85RPNB5C7E"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider };
