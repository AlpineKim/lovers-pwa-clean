function signIn() {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(result => {
      document.getElementById("user-info").textContent = "Signed in as " + result.user.displayName;
      loadChecklist(result.user.uid);
    })
    .catch(console.error);
}

function signOut() {
  auth.signOut().then(() => {
    document.getElementById("user-info").textContent = "";
    document.getElementById("checklist").innerHTML = "";
  });
}
