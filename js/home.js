let indexLookup = {
    "Topic": 0,
    "Location": 1,
    "Date": 2,
    "MaxCommit": 3,
    "Committed": 4
};
async function loadHome() {
    let data = [];
    await db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                data.push(doc.data());
            }
        });
    });

    let table = document.getElementById('event-list');
    table.deleteRow(1);
    let entries = table.rows.length;

    data.forEach ((el, i) => {
        let row = table.insertRow(entries+i);

        row.insertCell(indexLookup.Topic).innerHTML = el.Topic;
        row.insertCell(indexLookup.Location).innerHTML = el.Location;
        row.insertCell(indexLookup.Date).innerHTML = unixToDate(el.Date.seconds);
        row.insertCell(indexLookup.MaxCommit).innerHTML = el.MaxCommit;
        row.insertCell(indexLookup.Committed).innerHTML = el.Committed;
    });
}
