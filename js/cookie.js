//source: https://www.w3schools.com/js/js_cookies.asp

function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function checkCookie() {
    let sid = getCookie("sid");
    let user = getCookie("user");
    await db.collection("user").where("name", "==", user).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.exists) {
                if (!(doc.data().sid === sid)) {
                    setCookie("sid","",0);
                    setCookie("user","",0);
                    setCookie("userid","",0);
                }
            }
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function checkSession() {
    checkCookie();
    let sid = getCookie("sid");
    let user = getCookie("user");

    return !(sid === "" || user === "");
}
