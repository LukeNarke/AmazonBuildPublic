import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDTlgOy7IRwnZoQ-n2AnrsDPu3e57UByzk",
  authDomain: "build-ced72.firebaseapp.com",
  projectId: "build-ced72",
  storageBucket: "build-ced72.appspot.com",
  messagingSenderId: "33132826314",
  appId: "1:33132826314:web:f0e49a404dd0a65520ee33",
};

// initialize app
const firebaseApp = firebase.initializeApp(firebaseConfig);
// initialize database
const db = firebaseApp.firestore();
// initialize authorizations
const auth = firebase.auth();

// export so we can use outside of this file
export { db, auth };
