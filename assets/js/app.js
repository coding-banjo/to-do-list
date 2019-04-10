const { firebase, firebaseui } = window
const { firestore, auth } = firebase
const config = {
  apiKey: 'AIzaSyAFmkDynYd4zYul38bMyDXyPRomy0PmC8U',
  authDomain: 'coding-banjo-to-do-list.firebaseapp.com',
  databaseURL: 'https://coding-banjo-to-do-list.firebaseio.com',
  projectId: 'coding-banjo-to-do-list',
  storageBucket: 'coding-banjo-to-do-list.appspot.com',
  messagingSenderId: '613589343487'
}
const uiConfig = {
  signInSuccessUrl: 'index.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  tosUrl: 'https://google.com',
  privacyPolicyUrl: function () {
    window.location.assign('https://google.com')
  }
}
firebase.initializeApp(config)
const ui = new firebaseui.auth.AuthUI(auth())
ui.start('#auth-container', uiConfig)

