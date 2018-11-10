async function addEvent(form) {
    let topic = form.topic.value;
    let description = form.description.value;
    let maxcommit = form.maxcommit.value;
    let location = form.location.value;
    let adress = form.adress.value + ", " + location;
    let date = form.date.value;
    let time = form.time.value;
    let timestamp = new Date(Date.parse(date.toString()+ ' ' + time.toString()));

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
