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
          if (i === 0) {
            console.log(doc.id)
            currentListId = doc.id
          }
          doc.data().items.forEach(item => {
            let itemElem = document.createElement('div')
            itemElem.innerHTML = `
            <span>${item.value}</span>
            <button data-value="${item.value}" data-isCmplt="${item.isDone}" data-itemId="${item.id}" data-listId="${doc.id}" data-tmStmp="${item.timeStamp}" class="cmpltBtn ${item.isDone ? 'done' : 'notDone'}">${item.isDone ? 'Done' : 'Not Done'}</button>
            `
            document.querySelector('#currentList').append(itemElem)
          })
        })
      }
    })
    .catch(e => console.error(e))
}
const nowUser = userPresence => {
  document.querySelector('#auth-container').style.display = 'none'
  user = userPresence
  getLists()
}

const createNewList = _ => {
  currentListId = db.collection('lists').doc().id

  db.collection('lists').doc(currentListId).set({
    name: document.querySelector('#newList').value,
    items: [],
    uid: user.uid,
    timeStamp: Date.now()
  })
  getLists()
}

const createNewListItem = _ => {
  let currentItemId = db.collection('lists').doc().id
  db.collection('lists').doc(currentListId).update({
    items: firestore.FieldValue.arrayUnion({
      id: currentItemId,
      value: document.querySelector('#newItem').value,
      isDone: false,
      timeStamp: Date.now()
    })
  })
  getLists()
}

const toggleCmplt = ({ itemId, listId, isCmplt, value, tmStmp }) => {
  console.log(itemId, listId, isCmplt, value, tmStmp)
  db.collection('lists').doc(listId).update({
    items: firestore.FieldValue.arrayUnion({
      id: itemId,
      value: value,
      isDone: isCmplt !== 'true',
      timeStamp: tmStmp
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
document.addEventListener('click', ({ target: { className, dataset } }) => className.indexOf('cmpltBtn') >= 0 ? toggleCmplt(dataset) : null)

auth().onAuthStateChanged(userPresence => userPresence ? nowUser(userPresence) : null)
