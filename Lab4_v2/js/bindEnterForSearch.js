var input = document.getElementById("searchbar");

    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            console.log(input.value);
            var queryString = "?" + input.value;
            console.log(queryString)
            if(queryString!=="?"){
                window.location.href = "search.html" + queryString;
            }
        }
    });

var input2 = document.getElementById("searchbar2");

input2.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        console.log(input2.value);
        var queryString = "?" + input2.value;
        console.log(queryString)
        if(queryString!=="?"){
            window.location.href = "search.html" + queryString;
        }

    }
});
