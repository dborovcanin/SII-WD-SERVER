var fs = require('file-system');
var url = require('url');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var file = require("./scripts/filemodule.js");
var app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var templates = "./templates/";
var korisnicifajl = "./files/korisnici.json";

var korisnici = file.ucitajIzFajla(korisnicifajl);

// Ako gadjamo default, treba da se vrati ova stranica.
app.get('/', function (req, res) {
  var html = fs.readFileSync(templates + 'Primjer1.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

app.get('/templates/*', function (req, res) {
  var html = fs.readFileSync("."+ req.path);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

// Sav CSS je ovdje.
app.get('/styles/*', function (req, res) {
  var css = fs.readFileSync("." + req.path);
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.end(css);
});

// Sav JS kod je u scripts folderu.
app.get('/scripts/*', function (req, res) {
  var js = fs.readFileSync("." + req.path);
  res.writeHead(200, { 'Content-Type': 'text/javascript' });
  res.end(js);
});

// Svi resursi, uglavnom se odnosi na slike.
app.get('/resources/*', function (req, res) {
  res.sendFile(req.path, { root: path.join(__dirname, '.') });
});

// Samo primjer POST metode.
app.post('/logintest/', function (req, res) {
  var korisnik = null;
  for (i = 0; i < korisnici.length; i ++) {
  	if (req.body.ime == korisnici[i].korisnickoIme && req.body.sifra == korisnici[i].sifra) {
  		korisnik = korisnici[i];
  	}
  }
  if (korisnik) {
  	  res.writeHead(200, {"Content-Type": 'text/html'});
  	  res.end("Uspeli ste da se ulogujete kao " + korisnik.ime);
  }
  else {
	  res.writeHead(200, { 'Content-Type': 'text/html' });
	  res.end('Niste uspeli da se ulogujete');
	}
});

app.post('/registertest/', function (req, res) {
	var noviKorisnik = new Object;
	noviKorisnik.ime = req.body.ime;
	noviKorisnik.sifra = req.body.sifra;
	noviKorisnik.id = korisnici.length;
	korisnici.push(noviKorisnik);
	file.pisiUFajl(korisnicifajl, korisnici);
	res.redirect("/");
});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)