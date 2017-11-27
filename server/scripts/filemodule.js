var fs = require('file-system');

function ucitajIzFajla(imefajla) {
	var txt = fs.readFileSync(imefajla, 'utf8');
	var listaobjekata = JSON.parse(txt);

	return listaobjekata;
}

function pisiUFajl(imefajla, podaci) {
	var txt = JSON.stringify(podaci);
	fs.writeFileSync(imefajla, txt);
}

module.exports = {
	ucitajIzFajla : ucitajIzFajla,
	pisiUFajl : pisiUFajl,
};