import Rebase from 're-base';
import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  
    apiKey: "AIzaSyAUiCESDXPf8PpjO2AEReOr1JCZ024a3PY",
    authDomain: "catch-of-the-day-dan-wei-d55a3.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-dan-wei-d55a3.firebaseio.com",
    // projectId: "catch-of-the-day-dan-wei-d55a3",
    // storageBucket: "catch-of-the-day-dan-wei-d55a3.appspot.com",
    // messagingSenderId: "953784603039"
});

const base = Rebase.createClass(firebaseApp.database());

export {firebaseApp};

export default base;