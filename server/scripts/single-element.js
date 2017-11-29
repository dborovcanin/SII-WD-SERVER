function load(fillData) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            content = JSON.parse(xhttp.responseText);
            fillData(content);  
        }
    };
    xhttp.open("GET", "elementData" + window.location.search, true);
    xhttp.send();
}