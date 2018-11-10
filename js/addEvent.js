function validateInputs(topic, desc, max, loc, adr, time) {
    if (topic === "" || desc === "" || max <= 0 || loc === "") return false;
    if (Date.now() >= time) return false;
    // if (time.getFullYear() > (Date.now().getFullYear() + 1)) return false;
    if (topic.length > 100 || desc.length > 500 || max > 50 || loc.length > 200) return false;


    return true;
}

async function addEvent(form) {
    let topic = form.topic.value;
    let description = form.description.value;
    let maxcommit = form.maxcommit.value;
    let location = form.location.value;
    let adress = form.adress.value + ", " + location;
    let date = form.date.value;
    let time = form.time.value;
    let timestamp = new Date(Date.parse(date.toString()+ ' ' + time.toString()));

    if (!validateInputs(topic,description,maxcommit,location,adress,timestamp)) {
        alert("Bitte überprüfen Sie Ihre Eingaben!");
        return;
    }

    form.topic.value = "";
    form.description.value = "";
    form.maxcommit.value = "";
    form.location.value = "";
    form.adress.value = "";
    form.date.value = "";
    form.time.value = "";

    await db.collection("events").doc().set({
        Topic: topic,
        Location: location,
        Date: timestamp,
        MaxCommit: maxcommit,
        Committed: 0,
        Description: description,
        Adress: adress
    });
}
function initEventAdd() {
    let btn = document.getElementById("submitBtn");
    let valid = checkSession();
    btn.disabled = !valid;
}
