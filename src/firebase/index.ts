// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  ref as refStorage,
  getStorage,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNE7-FCG98BjZhUFWUjxu2qzaYrosp24M",
  authDomain: "r3f-character.firebaseapp.com",
  databaseURL:
    "https://r3f-character-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "r3f-character",
  storageBucket: "gs://r3f-character.appspot.com",
  messagingSenderId: "864784254552",
  appId: "1:864784254552:web:4644917df32940b62cec2d",
};

// Initialize Firebase
export const firebaseConfigApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseConfigApp);

export const fetchMedia = async () => {
  const pathReference = refStorage(
    storage,
    "gs://r3f-character.appspot.com/llama-assistant/output.mp3"
  );
  const urlSound = await getDownloadURL(pathReference);
  return urlSound;
};

export const uploadMedia = async (blob: Blob) => {
  const storageRef = refStorage(
    storage,
    "gs://r3f-character.appspot.com/llama-assistant/output.mp3"
  );
  await uploadBytes(storageRef, blob).then(() => {
    console.log("Upload a blob or file");
  });
};
