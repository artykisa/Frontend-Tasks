function getTrack(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()
    console.log(artist, track, lyrics)
    var trackNameElement = document.getElementById("track_name");
    trackNameElement.innerHTML = artist + " - " + track;

    const refAlbum = db.ref(`/Tracks/${artist}/${track}/album`);
    const refExplanation = db.ref(`/Explanation/${artist}/${track}/${lyrics}`)
    let textExplanation;
    refExplanation.on("value", function(snapshot) {
        console.log(snapshot.val());
        textExplanation = snapshot.val().split("\n")
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    refAlbum.on("value", function(snapshot) {
        console.log(snapshot.val());
        var textField = document.getElementById("track_album");
        textField.innerHTML = snapshot.val()
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    const refLyrics = db.ref(`/Tracks/${artist}/${track}/${lyrics}`);

    refLyrics.on("value", function(snapshot) {
        console.log(snapshot.val());
        var textField = document.getElementById("track_text");
        var textTrack = snapshot.val().split("\n")
        for (var i = 0; i < textTrack.length; i++) {
            var onclickParam = "explain" + i;
            if(textExplanation[i] != null && textExplanation[i]!==""){
                console.log("<span class='track_text_desc' data-title='" + textExplanation[i] + "'>" + textTrack[i] + "</span> <br />")

                textField.innerHTML += "<span class='track_text_desc'  onclick='onClickSpan(" + onclickParam+")' data-title='" + textExplanation[i] + "'>" + textTrack[i] + "</span> <input id='explain" + i + "' class='input-explain' onchange=\"updateLyrics("+textTrack.length+")\" style=\"visibility:hidden;\" type='text' value='"+ textExplanation[i]+"'><br />"
            }
            else{
                console.log(textTrack[i])
                textField.innerHTML += "<span onclick='onClickSpan(" + onclickParam+")'>" + textTrack[i] + "</span>  <input id='explain" + i + "' class='input-explain' onchange=\"updateLyrics("+textTrack.length+")\" style=\"visibility:hidden;\" type='text' value='"+ textExplanation[i]+"'> <br>"
            }
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function updateLyrics(length){
    let explanation = "";
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()
    console.log(queryString)
    for(var i = 0; i<length;i++){
        if(document.getElementById("explain" + i).value !== 'undefined'){
            explanation += document.getElementById("explain" + i).value + "\n";
        }
        else{
            explanation +=  "\n";
        }
    }
    firebase.database().ref(`/Explanation/${artist}/${track}/${lyrics}`)
        .set(explanation)
}

function onClickSpan(idLine){
    console.log('ONCLICK SPAN',idLine)
    if(idLine.style.visibility === 'visible'){
        idLine.style.visibility = 'hidden'
    }
    else{
        idLine.style.visibility = 'visible'
    }
}

function redirectToEditExplanation(){
    var queryString = decodeURIComponent(window.location.search);
    window.location.href = "editExplain.html" + queryString;
}

function getLikesLyrics(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()

    const refLikes = db.ref(`/Likes/${artist}/${track}/${lyrics}/Likes`)
    refLikes.on("value", function(snapshot) {
        console.log(snapshot.val());
        var textField = document.getElementById("track-buttons_like");
        textField.innerHTML = `Like(${snapshot.val().split("\n").length -1 })`
        console.log("HELLO",snapshot.val().split("\n").length);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    const refDislikes = db.ref(`/Likes/${artist}/${track}/${lyrics}/Dislikes`)
    refDislikes.on("value", function(snapshot) {
        console.log(snapshot.val());
        var textField = document.getElementById("track-buttons_dislike");
        textField.innerHTML = `Dislike(${snapshot.val().split("\n").length - 1})`
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function likeLyrics(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()

    const refLikes = db.ref(`/Likes/${artist}/${track}/${lyrics}/Likes`)
    let likes;
    let likesSplit;
    refLikes.on("value", function(snapshot) {
        likes = snapshot.val()
        likesSplit = snapshot.val().split("\n")
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(!likes.includes(user.email)){
                firebase.database().ref(`/Likes/${artist}/${track}/${lyrics}/Likes`)
                    .set(likes+user.email+"\n")
            }
            else{
                firebase.database().ref(`/Likes/${artist}/${track}/${lyrics}/Likes`)
                    .set(likes.replace(user.email+"\n",""))
            }
        }
        else{
            console.log("no user")
        }
    });

}

function dislikeLyrics(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()


    const refDislikes = db.ref(`/Likes/${artist}/${track}/${lyrics}/Dislikes`)
    let dislikes;
    let dislikesSplit;
    refDislikes.on("value", function(snapshot) {
        dislikes = snapshot.val()
        dislikesSplit = snapshot.val().split("\n")
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(!dislikes.includes(user.email)){
                firebase.database().ref(`/Likes/${artist}/${track}/${lyrics}/Dislikes`)
                    .set(dislikes+user.email+"\n")
            }
            else{
                firebase.database().ref(`/Likes/${artist}/${track}/${lyrics}/Dislikes`)
                    .set(dislikes.replace(user.email+"\n",""))
            }
        }
        else{
            console.log("no user")
        }
    });
}

function getComments(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()

    const refComments = db.ref(`/Comments/${artist}/${track}/${lyrics}`)
    //track-buttons_dislike
    refComments.on("value", function(snapshot) {
        console.log("hicku", snapshot.val())
        const commentsDoc = document.getElementById("comments");
        commentsDoc.innerHTML = ""
        Object.keys(snapshot.val()).forEach(element =>{
            console.log("DEAL WITH IT", snapshot.val())
            var div = document.createElement("div");
            div.setAttribute("class", "comment");
            var indiv = document.createElement("div");
            indiv.setAttribute("class", "comment_text");
            var span = document.createElement("span")
            span.setAttribute("class", "comment_text_nick")
            span.innerHTML =  element + ": "
            var p = document.createElement("p")
            p.setAttribute("class", "comment_text_text")
            p.innerHTML= snapshot.val()[element]['text']
            var likeBut = document.createElement("button")
            likeBut.setAttribute("class", "comment_like")
            likeBut.onclick = function () {
                likeComment(element)
            }
            likeBut.innerHTML = `LIKE(${snapshot.val()[element]['likes'].split('\n').length -1})`
            var dislikeBut = document.createElement("button")
            dislikeBut.setAttribute("class", "comment_dislike")
            dislikeBut.onclick = function () {
                dislikeComment(element)
            }
            dislikeBut.innerHTML = `DISLIKE(${snapshot.val()[element]['dislike'].split('\n').length -1})`
            indiv.appendChild(span);
            indiv.appendChild(p)
            indiv.appendChild(likeBut)
            indiv.appendChild(dislikeBut)
            div.appendChild(indiv)

            commentsDoc.appendChild(div);
            })
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

function dislikeComment(nick){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()


    const refDislikes = db.ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/dislike`)
    //track-buttons_dislike
    let dislikes;
    let dislikesSplit;
    refDislikes.on("value", function(snapshot) {
        dislikes = snapshot.val()
        dislikesSplit = snapshot.val().split("\n")
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(!dislikes.includes(user.email)){
                firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/dislike`)
                    .set(dislikes+user.email+"\n")
            }
            else{
                firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/dislike`)
                    .set(dislikes.replace(user.email+"\n",""))
            }
        }
        else{
            console.log("no user")
        }
    });
}

function likeComment(nick){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()


    const refLikes = db.ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/likes`)
    let likes;
    let likesSplit;
    refLikes.on("value", function(snapshot) {
        likes = snapshot.val()
        likesSplit = snapshot.val().split("\n")
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(!likes.includes(user.email)){
                firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/likes`)
                    .set(likes+user.email+"\n")
            }
            else{
                firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/likes`)
                    .set(likes.replace(user.email+"\n",""))
            }
        }
        else{
            console.log("no user")
        }
    });
}

function sendComment(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const lyrics = querySplit.pop()
    const track = querySplit.pop()
    const artist = querySplit.pop()
    const text = document.getElementById("comment_text").value
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var nick = user.email.split('@')[0]
            firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/text`)
                .set(text)
            firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/likes`)
                .set("")
            firebase.database().ref(`/Comments/${artist}/${track}/${lyrics}/${nick}/dislike`)
                .set("")
        }
        else{
            console.log("no user")
        }
    });

}
