const config = {
    apiKey: "AIzaSyD6il5jikNK_a7MppSfqmAKKQqBfBEEFzs",
    authDomain: "geniusweb-230e7.firebaseapp.com",
    databaseURL: "https://geniusweb-230e7-default-rtdb.firebaseio.com",
    projectId: "geniusweb-230e7",
    storageBucket: "geniusweb-230e7.appspot.com",
    messagingSenderId: "190018826266",
    appId: "1:190018826266:web:dcdee0ce7f624bd07c61a3",
    measurementId: "G-2LP4KR0HWW"
};

firebase.initializeApp(config);



const db = firebase.database();

function checkForUser() {

    firebase.auth().onAuthStateChanged(function(user) {
        var login = document.getElementById("login-ref");
        if (user) {
            login.innerHTML = "Profile"
            login.href = "profile.html"
            console.log("yes user")
        } else {
            login.innerHTML = "Log in"
            login.href = "login.html"
            console.log("no user")
        }
    });
}

function hamburger() {
    var x = document.getElementById("menu-links");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

checkForUser()

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
