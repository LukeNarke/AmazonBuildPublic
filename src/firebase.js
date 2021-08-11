import firebase from "firebase";

const firebaseConfig = {
//  config file here
};

// initialize app
const firebaseApp = firebase.initializeApp(firebaseConfig);
// initialize database
const db = firebaseApp.firestore();
// initialize authorizations
const auth = firebase.auth();

// export so we can use outside of this file
export { db, auth };
