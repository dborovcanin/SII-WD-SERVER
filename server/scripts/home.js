var content;
function fillTemplate(data, id) {

    var ad = document.createElement('div');
    ad.onclick = function() {
        window.location.href = "/element?id=" + id;
    }
    ad.classList.add('ad');
    ad.setAttribute('id', id);

    var title = document.createElement('div');
    title.appendChild(document.createTextNode(data.title));
    title.classList.add('title');

    var price = document.createElement('div');
    price.appendChild(document.createTextNode('TICKET: ' + data.price + ' RSD'));
    price.classList.add('price');

    var a = document.createElement('a');
    var img = document.createElement('img');
    img.setAttribute('src', data.image);
    img.classList.add('adImage');
    a.appendChild(img);

    ad.appendChild(a);
    ad.appendChild(title);
    ad.appendChild(price);
    return ad;
}

function srch(e) {
    if (e.keyCode == 13)
        searchByTitle();
}

function getData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            content = JSON.parse(xhttp.responseText);
            fillData(content);
        }
    };
    xhttp.open("GET", "/content", true);
    xhttp.send();
}

function fillData(data) {
    var advertisements = document.getElementById('ads');
    while (advertisements.firstChild) {
        advertisements.removeChild(advertisements.firstChild);
    }
    for (var elem in data) {
        advertisements.appendChild(fillTemplate(data[elem], data[elem].id));
    }
}

function searchByTitle() {
    var query = document.getElementById('search').value;
    var alertItem = document.getElementById('alertItem');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            content = JSON.parse(xhttp.responseText);
            fillData(content);
        }
    };
    xhttp.open("GET", "sadrzaj?criteria=" + query, true);
    xhttp.send();
}

function clearAlert() {
    document.getElementById('alertItem').textContent = '';

    var found = document.querySelectorAll("div.found");
    for (var item of found) {
        item.classList.remove('found');
    }
}