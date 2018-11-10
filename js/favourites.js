async function loadFavourites() {

    let table = document.getElementById('event-list');
    if (!checkSession()) {
        table.deleteRow(1);
        let cell = table.insertRow(1).insertCell(0);
        cell.innerHTML = "Bitte logge dich ein!";
        cell.setAttribute("colspan",7);
        return;
    }

    let user = getCookie("user");
    let userid = getCookie("userid");
    let fav = [];
    let favid;
    await db.collection("favorites").doc(userid).get().then((doc) => {
        if (doc.exists) {
            fav = doc.data().favorites;
            favid = doc.id;
        }
    });

    let data = {};
    await db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists && fav.includes(doc.id)) {
                data[doc.id] = doc.data();
                data[doc.id].id = doc.id;
            }
        });
    });

    table.deleteRow(1);
    let entries = table.rows.length;
    let elements = [];
    fav.forEach (async(el, i) => {
        let row = table.insertRow(entries+i);
        let e = data[el];
        let commits = 0;
        await db.collection("commits").doc(e.id).get().then((doc) => {
            if (doc.exists) {
                commits = doc.data().users.length;
            }
        });
        row.insertCell(indexLookup.Topic).innerHTML = "<a href='detailview.html?id=" + e.id + "' target='_top'>" + e.Topic + "</a>";
        row.insertCell(indexLookup.Location).innerHTML = e.Location;
        row.insertCell(indexLookup.Date).innerHTML = unixToDate(e.Date.seconds);
        row.insertCell(indexLookup.MaxCommit).innerHTML = e.MaxCommit;
        row.insertCell(indexLookup.Committed).innerHTML = commits;

        let checkBox = document.createElement("INPUT");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", e.id);
        checkBox.setAttribute("disabled", true);
        checkBox.addEventListener("click", (el) =>{addToFavorites(el)});
        row.insertCell(indexLookup.Favorites).appendChild(checkBox);
        elements.push(checkBox);

        row.insertCell(indexLookup.ID).innerHTML ="<a href='detailview.html?id=" + e.id + "' target='_top'>" + e.id + "</a>";
    });

    let session = checkSession();

    if (session) {
        let user = getCookie("user");
        let userid = getCookie("userid");
        let fav = [];
        let favid;
        await db.collection("favorites").doc(userid).get().then((doc) => {
            if (doc.exists) {
                fav = doc.data().favorites;
                favid = doc.id;
            }
        });
        for (e of elements) {
            let elid = e.getAttribute("id");
            e.checked = fav.includes(elid);
            e.disabled = false;
        }
    }
}
