function edit() {
    // Reguarni izraz za parsiranje naziva fajla, a potom se konkatenira na podarazumevani
    // folder resources u kome se nalaze slike. Ne radi se pravi uload slike na tu putanju. 
    var image = "../resources/imgs/";     
    if (!document.getElementById("new-image").value)
        image = document.getElementById("image").getAttribute("src");
    else
        image += document.getElementById("new-image").value.split(/(\\|\/)/g).pop();
    console.log(image);
    var title = document.getElementById("title").value;
    var price = document.getElementById("price").value;
    var search = window.location.search;
    var body = { title: title, price: price, image: image };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            window.location.pathname = "/";
    }
    xhttp.open("PUT", "/edit" + search, true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(JSON.stringify(body));
    return false;
}