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
