function addTrack(artist, track, album){
    console.log(artist,track, album)
    var queryString = "?" + artist + "&" + track
    console.log(queryString)
    firebase.database().ref(`/Tracks/${artist}/${track}/album`)
        .set(album)
        .then(function onSuccess(res) {
            window.location.href = "searchLyrics.html" + queryString;
    })

}

function onSubmitClick(){
    var artist = document.getElementById('author').value
    var track = document.getElementById('name').value
    var album = document.getElementById('album').value
    console.log(artist,track,album)
    addTrack(artist, track, album)
}



