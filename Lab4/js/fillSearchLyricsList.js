function fillSearchLyricsList(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    console.log(queryString)
    const querySplit = queryString.split('&');
    console.log(querySplit)
    const track = querySplit.pop()
    const artist = querySplit.pop()
    console.log(queryString)
    const ref = db.ref(`/Tracks/${artist}/${track}`);

    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        console.log(Object.keys(snapshot.val()));
        var ul = document.getElementById("ul-track-list");
        Object.keys(snapshot.val()).forEach(element =>{
            if(element !== 'album'){
                var li = document.createElement("li");
                li.setAttribute("class", "track-list_track_ref");
                li.appendChild(document.createTextNode(element));
                li.onclick = function () {
                    redirectToTrack(artist, track, element)
                }
                ul.appendChild(li);
            }
        })
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function redirectToTrack(artist, track, trackLyrics){
    var queryString = "?" + artist + "&" + track + "&" + trackLyrics;
    console.log(queryString)
    window.location.href = "track.html" + queryString;
}

function redirectToAddLyrics(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    const querySplit = queryString.split('&');
    const track = querySplit.pop()
    const artist = querySplit.pop()
    var queryString = "?" + artist + "&" + track;
    window.location.href = "addLyrics.html" + queryString;
}
