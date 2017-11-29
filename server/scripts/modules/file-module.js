var fs = require('file-system');

function readFromFile(imefajla) {
	var txt = fs.readFileSync(imefajla, 'utf8');
	var listaobjekata = JSON.parse(txt);

	return listaobjekata;
}

function writeToFile(imefajla, podaci) {
	var txt = JSON.stringify(podaci);
	fs.writeFileSync(imefajla, txt);
}

module.exports = {
	readFromFile: readFromFile,
	writeToFile: writeToFile,
};