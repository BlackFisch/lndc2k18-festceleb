let indexLookup = {
    "Topic": 0,
    "Location": 1,
    "Date": 2,
    "MaxCommit": 3,
    "Committed": 4,
    "Favorites": 5,
    "ID": 6
};

async function loadHome() {
    let data = [];
    await db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                console.log(doc.id);
                let dat = doc.data();
                dat["id"] = doc.id;
                console.log(dat);
                data.push(dat);
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

        let checkBox = document.createElement("INPUT");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", el.id);
        checkBox.setAttribute("disabled", true);
        checkBox.setAttribute("class", "main-favorite");
        checkBox.addEventListener("click", (el) =>{addToFavorites(el)});
        row.insertCell(indexLookup.Favorites).appendChild(checkBox);

        row.insertCell(indexLookup.ID).innerHTML = el.id;
    });

    let session = checkSession();
    // let elements = document.getElementsByAttribute("type", "checkbox");
    let elements = document.querySelector("#event-list").querySelectorAll("input[type='checkbox']");
    for (e of elements) {
        e.disabled = !session;
    }

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
            e.checked = fav.find(x => x == elid);
        }
    }
}

async function addToFavorites(el) {
    console.log(el);
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
