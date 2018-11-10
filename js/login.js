// Source: https://gist.github.com/gordonbrander/2230317
function generateSID() {
    let sid = "_";
    for (i=0; i<5; i++) {
        sid += Math.random().toString(36).substr(2, 9);
    }
    return sid;
};

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
            alert("Sie wurden erfolgreich eingeloggt!");
        } else {
            alert("Password incorrect!");
        }
    }
}
