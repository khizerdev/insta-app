import firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyD17oMqeGgvvThv3Pn_hrQuqKToVNbtARI",
    authDomain: "insta-6ff40.firebaseapp.com",
    databaseURL: "https://insta-6ff40.firebaseio.com",
    projectId: "insta-6ff40",
    storageBucket: "insta-6ff40.appspot.com",
    messagingSenderId: "497755318485",
    appId: "1:497755318485:web:ec7e8ecf4dd6f5b15a5a5c"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db,auth,storage}

