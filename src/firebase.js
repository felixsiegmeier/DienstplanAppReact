// firebase config credentials and database-connection-Object

import {initializeApp} from "firebase/app"
import {initializeFirestore} from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD4AOuXA9NjiFX8rDG4JXa97fRp3RdXi14",
    authDomain: "dienstplan-b5ca7.firebaseapp.com",
    projectId: "dienstplan-b5ca7",
    storageBucket: "dienstplan-b5ca7.appspot.com",
    messagingSenderId: "459691190026",
    appId: "1:459691190026:web:56282b3dae71523e293cf3",
    measurementId: "G-HHMERLJ0BF"
  };

  const app = initializeApp(firebaseConfig);

  export const db = initializeFirestore(app, {experimentalAutoDetectLongPolling: true})