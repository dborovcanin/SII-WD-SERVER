var korisnici = document.cookie();


function fillTemplate(data, id) {
    var korisnik = document.createElement('div');
    
    korisnik.classList.add('korisnik');
    korisnik.setAttribute('id', id);

    var title = document.createElement('div');
    title.appendChild(document.createTextNode(data.ime));
    title.classList.add('adTitle');


    korisnik.appendChild(title);
    return korisnik;
}

function ubaciKorisnike(data) {
    var korisnici = document.getElementById('korisnici');
    for (var elem in data) {
        korisnici.appendChild(fillTemplate(data[elem], elem));
    }
}