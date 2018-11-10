// Source: https://gist.github.com/gordonbrander/2230317
function generateSID() {
    let sid = "_";
    for (i=0; i<5; i++) {
        sid += Math.random().toString(36).substr(2, 9);
    }
    return sid;
};

function loadLogin() {
    let ref = getUrlVars()["ref"];
    let p = document.getElementById("status");
    if (ref === "logout") {
        resetCookies();
        let loc = location.href;
        loc = loc.substring(0, loc.indexOf('?'));
        location.replace(loc + "?ref=success_logout");
    } else if (ref === "success_logout") {
        p.innerHTML = "<font color='green'><b>Sie wurden erfolgreich ausgeloggt!</b></font>";
    } else if (ref === "success_login") {
        p.innerHTML = "<font color='green'><b>Sie wurden erfolgreich eingeloggt!</b></font>";
    }
}

async function performLogin(form) {
    let user = form.user.value;
    let pass = SHA512(form.pass.value);

    let correctPass = null;
    let id;
    await db.collection("user").where("name", "==", user).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.exists) {
                correctPass = doc.data().password;
                id = doc.id;
            }
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    if (correctPass === null) {
        alert("User does not exist!");
    } else {
        if (correctPass === pass) {
            let sid = generateSID();
            await db.collection("user").doc(id).set({
                sid: sid
            }, { merge: true });
            setCookie("sid",sid,2);
            setCookie("user",user,2);
            setCookie("userid",id,2);
            let loc = location.href;
            loc = loc.substring(0, loc.indexOf('?'));
            location.replace(loc + "?ref=success_login");
        } else {
            alert("Password incorrect!");
        }
    }
}
