async function loadHome() {
    let data = [];
    await db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                let dat = doc.data();
                dat["id"] = doc.id;
                data.push(dat);
            }
        });
    });

    let table = document.getElementById('event-list');
    table.deleteRow(1);

    let elements = [];
    let entries = table.rows.length;
    await data.forEach (async (el, i) => {
        let row = table.insertRow(entries+i);
        let commits = 0;
        await db.collection("commits").doc(el.id).get().then((doc) => {
            if (doc.exists) {
                commits = doc.data().users.length;
            }
        });

        row.insertCell(indexLookup.Topic).innerHTML = "<a href='sites/detailview.html?id=" + el.id + "' target='_top'>" + el.Topic + "</a>";
        row.insertCell(indexLookup.Location).innerHTML = el.Location;
        row.insertCell(indexLookup.Date).innerHTML = unixToDate(el.Date.seconds);
        row.insertCell(indexLookup.MaxCommit).innerHTML = el.MaxCommit;
        row.insertCell(indexLookup.Committed).innerHTML = commits;

        let checkBox = document.createElement("INPUT");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", el.id);
        checkBox.setAttribute("disabled", true);
        checkBox.addEventListener("click", (el) =>{addToFavorites(el)});
        row.insertCell(indexLookup.Favorites).appendChild(checkBox);
        elements.push(checkBox);

        row.insertCell(indexLookup.ID).innerHTML ="<a href='sites/detailview.html?id=" + el.id + "' target='_top'>" + el.id + "</a>";
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

async function addToFavorites(el) {
    let id = el.originalTarget.id;
    if (!checkSession()) return;
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

    if (el.originalTarget.checked) {
        fav.push(id);
    } else {
        fav.pop(id);
    }

    await db.collection("favorites").doc(userid).set({
        favorites: fav
    });
}
