var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

function logout(){
    firebase.auth().signOut().then(() => {
        console.log("logout OK")
        location.replace("../html/main.html")
    }).catch((error) => {
        console.log("logout ERROR")
    });
}

function redirectToAddTrack(){
    window.location.href = "addTrack.html";
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var textField = document.getElementById("greetings");
        textField.innerHTML = user.email
    }
    else{
        console.log("no user")
    }
});
