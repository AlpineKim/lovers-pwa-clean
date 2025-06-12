const items = ["kissing", "holding hands", "cuddling", "oral", "toys", "dirty talk"];

function saveResponse(uid, item, response) {
  db.collection("checklists").add({ uid, item, response });
}

function loadChecklist(uid) {
  const container = document.getElementById("checklist");
  container.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `${item}: 
      <button onclick="saveResponse('${uid}', '${item}', 'Yes')">Yes</button>
      <button onclick="saveResponse('${uid}', '${item}', 'Future')">Yes</button>
      <button onclick="saveResponse('${uid}', '${item}', 'Maybe')">Maybe</button>
      <button onclick="saveResponse('${uid}', '${item}', 'No')">No</button>
      <span id="response-${item}"></span>`;
    container.appendChild(div);
  });

  db.collection("checklists").where("uid", "==", uid).get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const span = document.getElementById("response-" + data.item);
      if (span) span.textContent = " (selected: " + data.response + ")";
    });
  });
}
