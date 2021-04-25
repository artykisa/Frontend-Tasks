function addLyrics(artist, track, lyrics, text){
    console.log(artist,track,lyrics,text)
    const length = text.split('\n').length
    let explanation = "";
    var queryString = "?" + artist + "&" + track + "&" + lyrics;
    console.log(queryString)
    for(var i =0;i<length;i++){
        explanation += "\n"
    }
    firebase.database().ref(`/Tracks/${artist}/${track}/${lyrics}`)
        .set(text)
    firebase.database().ref(`/Explanation/${artist}/${track}/${lyrics}`)
        .set(explanation)

    firebase.database().ref(`/Likes/${artist}/${track}/${lyrics}/Likes`)
        .set("")
    firebase.database().ref(`/Likes/${artist}/${track}/${lyrics}/Dislikes`)
        .set("")
        .then(function onSuccess(res) {
            window.location.href = "track.html" + queryString;
    })


}

function onSubmitClick(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const track = querySplit.pop()
    const artist = querySplit.pop()
    var text = document.getElementById('text').value
    var select = document.getElementById('select').value
    console.log(text,select)
    addLyrics(artist, track, track+"_"+select, text)
}
