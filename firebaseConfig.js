// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh30YAal0BJrTwHAX6xvpXp5t6ua7El1Y",
  authDomain: "snake-game-react-70097.firebaseapp.com",
  projectId: "snake-game-react-70097",
  storageBucket: "snake-game-react-70097.firebasestorage.app",
  messagingSenderId: "442340827416",
  appId: "1:442340827416:web:73aa9568afc548b56f3e6d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
