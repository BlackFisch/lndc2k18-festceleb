// Initialize Google Firebase
let config = {
  apiKey: "AIzaSyD7wsK1M0rIGRPV3Zdh5yXVkfu2N_gKmbk",
  authDomain: "festceleb.firebaseapp.com",
  databaseURL: "https://festceleb.firebaseio.com",
  projectId: "festceleb",
  storageBucket: "festceleb.appspot.com",
  messagingSenderId: "634122092623"
};
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
let db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

async function addEvent(form) {
    let topic = form.topic.value;
    let description = form.description.value;
    let maxcommit = form.maxcommit.value;
    let location = form.location.value;
    let adress = form.adress.value + ", " + location;
    let date = form.date.value;
    let time = form.time.value;
    let timestamp = new Date(Date.parse(date.toString()+ ' ' + time.toString()));

    await db.collection("events").doc().set({
        Topic: topic,
        Location: location,
        Date: timestamp,
        MaxCommit: maxcommit,
        Committed: 0,
        Description: description,
        Adress: adress
    });
}
