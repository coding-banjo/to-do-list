const { firebase, firebaseui } = window
const { firestore, auth } = firebase
let user,
  currentListId

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
const db = firestore()

const getLists = _ => {
  db.collection('lists').where('uid', '==', user.uid).get()
    .then(({ docs }) => {
      if (docs) {
        document.querySelector('#currentList').innerHTML = ''
        document.querySelector('#currentListContainer').style.display = 'block'
        docs.forEach((doc, i) => {
          console.log(doc.data())
          if (!i) {
            currentListId = doc.data().id
          }
          doc.data().items.forEach(item => {
            let itemElem = document.createElement('li')
            itemElem.innerHTML = `
            ${item.value}
            <button>${item.isDone ? 'Done' : 'Not Done'}</button>
            `
            document.querySelector('#currentList').append(itemElem)
          })
        })
      }
    })
}
const nowUser = userPresence => {
  document.querySelector('#auth-container').style.display = 'none'
  user = userPresence
  getLists()
}

const createNewList = _ => {
  currentListId = db.collection('lists').doc().id

  db.collection('lists').doc(id).set({
    name: document.querySelector('#newList').value,
    items: [],
    uid: user.uid
  })
  getLists()
}

const createNewListItem = _ => {
  let currentItemId = db.collection('lists').doc().id
  db.collection('lists').doc(currentListId).update({
    items: firestore.FieldValue.arrayUnion({
      id: currentItemId,
      value: document.querySelector('#newItem').value,
      isDone: false
    })
  })
  getLists()
}

document.querySelector('#createNewList').addEventListener('click', e => {
  e.preventDefault()
  createNewList()
})
document.querySelector('#createNewListItem').addEventListener('click', e => {
  e.preventDefault()
  createNewListItem()
})

auth().onAuthStateChanged(userPresence => userPresence ? nowUser(userPresence) : null)
