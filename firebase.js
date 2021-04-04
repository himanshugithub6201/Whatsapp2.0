import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyA08Onf8qqH9B6sH02WmOrMNniJfkY-Wjc",
    authDomain: "whatsappclone2-cfd0c.firebaseapp.com",
    projectId: "whatsappclone2-cfd0c",
    storageBucket: "whatsappclone2-cfd0c.appspot.com",
    messagingSenderId: "607228811214",
    appId: "1:607228811214:web:cf2b5c92794b3fbb33fd9f"
  };

const app=!firebase.apps.length
     ?firebase.initializeApp(firebaseConfig)
     :firebase.app();

const db=app.firestore();
const auth=app.auth();
const provider =new firebase.auth.GoogleAuthProvider();

export {db,auth,provider};