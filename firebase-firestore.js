const items = ["kissing", "holding hands", "cuddling", "oral", "toys", "dirty talk"];

function saveResponse(uid, item, response) {
  const btns = document.querySelectorAll(`[data-item='${item}'] button`);
  btns.forEach(btn => btn.classList.remove("selected"));
  const selectedBtn = document.querySelector(`[data-item='${item}'] button[data-response='${response}']`);
  if (selectedBtn) selectedBtn.classList.add("selected");

  db.collection("checklists")
    .add({ uid, item, response, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
}

function loadChecklist(uid) {
  const container = document.getElementById("checklist");
  container.innerHTML = "";
  const responses = {};

  db.collection("checklists")
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!responses[data.item]) {
          responses[data.item] = {
            response: data.response,
            timestamp: data.timestamp?.toDate().toLocaleString() || ""
          };
        }
      });

      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";
        div.setAttribute("data-item", item);
        const meta = responses[item] ? `<span class="meta">(Last: ${responses[item].timestamp})</span>` : "";
        div.innerHTML = `${item}:${meta}
          <button data-response="yes" onclick="saveResponse('${uid}', '${item}', 'yes')">Yes</button>
          <button data-response="maybe" onclick="saveResponse('${uid}', '${item}', 'maybe')">Maybe</button>
          <button data-response="no" onclick="saveResponse('${uid}', '${item}', 'no')">No</button>
          <span id="response-${item}"></span>`;
        container.appendChild(div);
        if (responses[item]) {
          const btn = div.querySelector(`button[data-response='${responses[item].response}']`);
          if (btn) btn.classList.add("selected");
        }
      });
    });
}

// Globalize
window.loadChecklist = loadChecklist;
window.saveResponse = saveResponse;
