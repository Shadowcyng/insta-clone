
  import  firebase from 'firebase';
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDBRPtuB5UtHniBQWB7UjdLngnQGdGQi4Q",
    authDomain: "instagram-clone-cbf80.firebaseapp.com",
    databaseURL: "https://instagram-clone-cbf80.firebaseio.com",
    projectId: "instagram-clone-cbf80",
    storageBucket: "instagram-clone-cbf80.appspot.com",
    messagingSenderId: "634647048006",
    appId: "1:634647048006:web:746b7fe37c3b911880bf47",
    measurementId: "G-GSM0TPGHPG"
  });
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth,storage};