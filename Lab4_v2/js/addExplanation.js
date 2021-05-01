function getExplanation(){
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
    refAlbum.on("value", function(snapshot) {
        console.log(snapshot.val());
        var textField = document.getElementById("track_album");
        textField.innerHTML = snapshot.val()
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    const refExplanation = db.ref(`/Explanation/${artist}/${track}/${lyrics}`)
    let textExplanation;
    refExplanation.on("value", function(snapshot) {
        console.log(snapshot.val());
        textExplanation = snapshot.val().split("\n")
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    const refLyrics = db.ref(`/Tracks/${artist}/${track}/${lyrics}`);

    refLyrics.on("value", function(snapshot) {
        console.log(snapshot.val());
        var textField = document.getElementById("track_text");
        var textTrack = snapshot.val().split("\n")
        for (var i = 0; i < textTrack.length; i++) {
            if(textExplanation[i] != null && textExplanation[i]!=="") {
                textField.innerHTML += "<div><p>" + textTrack[i] + "</p><input id='input-explain" + i + "' class='input-explain' type='text' value='"+ textExplanation[i]+"'></div>"
            }
            else{
                textField.innerHTML += "<div><p>" + textTrack[i] + "</p><input id='input-explain" + i + "' class='input-explain' type='text'></div>"
            }
        }

        textField.innerHTML += "<input class='track_text_button' type='button' value='Submit' onclick='addExplanation(\""+artist+"\",\""+track+"\",\""+lyrics+"\","+textTrack.length+")'>"
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function addExplanation(artist, track, lyrics, length){
    let explanation = "";
    var queryString = "?" + artist + "&" + track + "&" + lyrics;
    console.log(queryString)
    for(var i = 0; i<length;i++){
        explanation += document.getElementById("input-explain" + i).value + "\n";
    }
    firebase.database().ref(`/Explanation/${artist}/${track}/${lyrics}`)
        .set(explanation)
        .then(function onSuccess(res) {
            window.location.href = "track.html" + queryString;
        })

}
