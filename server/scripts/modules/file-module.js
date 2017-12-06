var fs = require('fs');

// Citanje iz fajla.
function readFromFile(fileName) {
	var txt = fs.readFileSync(fileName, 'utf8');
	var listOfObjects = JSON.parse(txt);
	return listOfObjects;
}

// Upis u fajl.
function writeToFile(fileName, data) {
	var txt = JSON.stringify(data);
	fs.writeFileSync(fileName, txt);
}

function read(path) {
	return fs.readFileSync(path);
}

module.exports = {
	readFromFile: readFromFile,
	writeToFile: writeToFile,
	read: read
};