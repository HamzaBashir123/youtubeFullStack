import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyABzQzf3eiNfWICue1UwXHIhEAFr1gfUH8",
    authDomain: "video-e6452.firebaseapp.com",
    projectId: "video-e6452",
    storageBucket: "video-e6452.appspot.com",
    messagingSenderId: "1079336606806",
    appId: "1:1079336606806:web:2d785000a6e8fc755aeff7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, auth, provider, storage, ref, uploadBytesResumable, getDownloadURL }