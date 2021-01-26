import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCflR33qPMplNBBYgf2d92mDgUo4oLZhbM",
    authDomain: "project-6b2da.firebaseapp.com",
    projectId: "project-6b2da",
    storageBucket: "project-6b2da.appspot.com",
    messagingSenderId: "935262720425",
    appId: "1:935262720425:web:fc11ace68fd2c45f73f4b8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()