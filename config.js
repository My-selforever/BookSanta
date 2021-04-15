import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyDeQPib7WO40UkdIt6HXGjEyaXOGe3WXhY",
    authDomain: "book-santa-829cd.firebaseapp.com",
    projectId: "book-santa-829cd",
    storageBucket: "book-santa-829cd.appspot.com",
    messagingSenderId: "266623880063",
    appId: "1:266623880063:web:9dc4848a21a34228dce84a"
  };
  
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }
  else{
    firebase.app()
  }
    export default firebase.firestore();