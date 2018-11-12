async function loadDetails() {
    let table = document.getElementById('event-list');
    let key = getUrlVars()["id"];

    let data = {};
    await db.collection("events").doc(key).get().then((doc) => {
        if (doc.exists) {
            data = doc.data();
        }
    });

    document.getElementById('event-list').deleteRow(0);

    let session = checkSession();

    let commits = [];
    await db.collection("commits").doc(key).get().then((doc) => {
        if (doc.exists) {
            commits = doc.data().users;
        }
    });
    let committed = session && (commits.includes(getCookie("userid")));

    let commitnum = 0;
    await db.collection("commits").doc(key).get().then((doc) => {
        if (doc.exists) {
            commitnum = doc.data().users.length;
        }
    });

    let btn = document.getElementById("commit");
    if (committed) {
        btn.innerHTML = "Absagen";
    } else {
        btn.innerHTML = "Zusagen";
    }
    btn.disabled = (!checkSession() || (data.MaxCommit >= commitnum));

    document.getElementById('topic').innerHTML = data.Topic;
    document.getElementById('description').innerHTML = data.Description;
    document.getElementById('MaxCommit').innerHTML = data.MaxCommit;
    document.getElementById('committed').innerHTML = commitnum;
    if (committed) {
        document.getElementById('datetime').innerHTML = unixToDateTime(data.Date.seconds);
    } else {
        document.getElementById('datetime').innerHTML = unixToDate(data.Date.seconds) + " [genaue Zeit versteckt]";
    }
    if (committed) {
        document.getElementById('adress').innerHTML = data.Adress;
    } else {
        document.getElementById('adress').innerHTML = "[genaue Adresse versteckt] " + data.Location;
    }
}

async function addCommit() {
    let id = getUrlVars()["id"];
    if (!checkSession()) return;
    let btn = document.getElementById("commit");
    btn.disabled = true;
    let user = getCookie("user");
    let userid = getCookie("userid");

    let commits = [];
    await db.collection("commits").doc(id).get().then((doc) => {
        if (doc.exists) {
            commits = doc.data().users;
        }
    });

    let maxCommits = 0;
    await db.collection("events").doc(id).get().then((doc) => {
        if (doc.exists) {
            maxCommits = doc.data().MaxCommit;
        }
    });

    if (btn.innerHTML === "Zusagen") {
        if (commits >= maxCommits) {
            alert("Die maximale Anzahl Zusagen wurde erreicht!");
            return;
        }
        commits.push(userid);
    } else {
        commits.pop(userid);
    }

    await db.collection("commits").doc(id).set({
        users: commits
    });

    location.reload();
}
