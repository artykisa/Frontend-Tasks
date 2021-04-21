function fillSearchList(){
        var queryString = decodeURIComponent(window.location.search);
        queryString = queryString.substring(1);
        const ref = db.ref(`/Tracks/${queryString}`);

        ref.on("value", function(snapshot) {
                var ul = document.getElementById("ul-track-list");
                if(snapshot.val() == null){
                        var li = document.createElement("li");
                        li.appendChild(document.createTextNode("No data found"));
                        ul.appendChild(li)
                }
                Object.keys(snapshot.val()).forEach(element =>{
                        var li = document.createElement("li");
                        li.setAttribute("class", "track-list_track_ref");
                        li.appendChild(document.createTextNode(element));
                        li.onclick = function () {
                                redirectToSearchLyrics(queryString, element)
                        }
                        ul.appendChild(li);
                })
        }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
        });
}

function redirectToSearchLyrics(artist, track){
        var queryString = "?" + artist + "&" + track;
        console.log(queryString)
        window.location.href = "searchLyrics.html" + queryString;
}
