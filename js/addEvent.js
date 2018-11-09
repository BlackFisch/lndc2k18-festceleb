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

let indexLookup = {
    "Topic": 0,
    "Location": 1,
    "Date": 2,
    "MaxCommit": 3,
    "Committed": 4
};

async function addEvent(form) {
    let topic = form.topic.value;
    let description = form.description.value;
    let maxcommit = form.maxcommit.value;
    let location = form.location.value;
    let adress = form.adress.value + ", " + location;
    let date = form.date.value;
    let time = form.time.value;
    let timestamp = Date.parse(date.toString()+ ' ' + time.toString());

    await db.collection("events").doc().set({
        Topic: topic,
        Location: location,
        Date: timestamp,
        MaxCommit: maxcommit,
        Committed: 0,
        Description: description,
        Adress : adress
    });
}

// async function loadHome() {
//     let data = [];
//     let events = await db.collection("events").get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             if (doc.exists) {
//                 console.log(true);
//                 data[0]=(doc.data());
//             }
//         });
//     });
//     console.log(data.length);
//
//     let table = document.getElementById('event-list');
//     let entries = table.rows.length;
//
//     data.forEach ((el, i) => {
//         let row = table.insertRow(entries+i);
//
//         row.insertCell(indexLookup.Topic).innerHTML = el.Topic;
//         row.insertCell(indexLookup.Location).innerHTML = el.Location;
//         row.insertCell(indexLookup.Date).innerHTML = unixToDate(el.Date.seconds);
//         row.insertCell(indexLookup.MaxCommit).innerHTML = el.MaxCommit;
//         row.insertCell(indexLookup.Committed).innerHTML = el.Committed;
//     });
// }

//Source: https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
function unixToDate(timestamp) {
	// Convert timestamp to milliseconds
	let date = new Date(timestamp*1000);

	// retrieve date
	let year = date.getFullYear();
	let month = 1+date.getMonth();
	let day = date.getDate();

	// retrieve time
	let hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	let seconds = "0" + date.getSeconds();

	// Display date in dd.MM.yyyy format
	return (day + '.' + month + '.' + year);
}
function unixToDateTime(timestamp) {
    let dateFormat = unixToDate(timestamp);
	// Convert timestamp to milliseconds
	let date = new Date(timestamp*1000);

	// retrieve time
	let hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	let seconds = "0" + date.getSeconds();

	// Display date time in dd.MM.yyyy h:m:s format
	return (dateFormat + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
}
