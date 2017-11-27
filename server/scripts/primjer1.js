var content = [{ price: '150', title: 'Naslov prvi', image: '../resources/imgs/img1.jpg' },
{ price: '300', title: 'Naslov drugi', image: '../resources/imgs/img2.jpg' },
{ price: '250', title: 'Naslov treci', image: '../resources/imgs/img3.jpg' },
{ price: '280', title: 'Naslov cetvrti', image: '../resources/imgs/img4.jpg' }];


function fillTemplate(data, id) {

    var ad = document.createElement('div');
    ad.onclick = function() {
        alert("AAAA");
    }
    ad.classList.add('ad');
    ad.setAttribute('id', id);

    var title = document.createElement('div');
    title.appendChild(document.createTextNode(data.title));
    title.classList.add('adTitle');

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

function fillData(data) {
    var advertisements = document.getElementById('ads');
    for (var elem in data) {
        advertisements.appendChild(fillTemplate(data[elem], elem));
    }
}

function searchByTitle() {
    var query = document.getElementById('search').value;
    var alertItem = document.getElementById('alertItem');
    if (query == "" && alertItem.textContent == "") {
            alertItem.appendChild(document.createTextNode('Please insert valid query!'));
    }
    else {
        var q = query.toLowerCase();
        for (dinosaurus in content) {
            if (content[dinosaurus].title.toLowerCase().includes(q)) {
                document.getElementById(dinosaurus).classList.add('found');
            }
        }
    }
}

function clearAlert() {
    document.getElementById('alertItem').textContent = '';

    // var found = document.getElementsByClassName('found');
    // var i;
    // var indexes = []
    // for (i = 0; i < found.length; i++) {
    //     indexes.push(found[i].id);
    // }

    // for (ind in indexes)
    //     document.getElementById(indexes[ind]).className = 'ad';
    var found = document.querySelectorAll("div.found");
    // for (var i = 0; i < found.length; i++) {
    //     document.getElementById(i).className = 'ad';
    // }
    for (var item of found) {
        // item.className = 'ad';
        item.classList.remove('found');
    }
}