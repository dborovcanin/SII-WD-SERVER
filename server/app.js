var fs = require('file-system');
var url = require('url');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var file = require("./scripts/modules/file-module.js");
var searchEngine = require("./scripts/modules/search-module.js");
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var templates = "./templates/";
var korisniciFajl = "./files/korisnici.json";
var sadrzajFajl = "./files/sadrzaj.json";

var korisnici = file.ucitajIzFajla(korisniciFajl);
var sadrzaj = file.ucitajIzFajla(sadrzajFajl);

// Ako gadjamo default, treba da se vrati ova stranica.
app.get('/', function (req, res) {
  var html = fs.readFileSync(templates + 'home.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

// HTML kod.
app.get('/templates/*', function (req, res) {
  var html = fs.readFileSync("." + req.path);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

app.get('/login', function (req, res) {
  var html = fs.readFileSync("./templates" + req.path + ".html");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

app.get('/register', function (req, res) {
  var html = fs.readFileSync("./templates" + req.path + ".html");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

// Sav CSS je ovdje.
app.get('/styles/*', function (req, res) {
  var css = fs.readFileSync("." + req.path);
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.end(css);
});

// Zabranjen pristup Express modulima.
app.all('/scripts/modules/*', function (req,res, next) {
  res.status(403).send({
     message: 'Access Forbidden'
  });
});

// Sav JS kod je u scripts folderu.
app.get('/scripts/*.js', function (req, res) {
  var js = fs.readFileSync("." + req.path);
  res.writeHead(200, { 'Content-Type': 'text/javascript' });
  res.end(js);
});


app.get('/element', function(req, res) {
  var html = fs.readFileSync("./templates" + req.path + ".html");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
})

app.get('/izmeni', function(req, res) {
  var html = fs.readFileSync("./templates" + req.path + ".html");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
})

/*
Adresa koja klijentu vraca pojedinacne elemente liste sadrzaj, u zavisnosti od toga
koje je id u zahtevu
*/
app.get('/elementData*', function (req, res) {
  var ret = null;
  if (Object.keys(req.query).length === 0)
    notFound(req, res);
  var id = req.query.id;
  ret = sadrzaj.find(function(element) {
    return element.id == id;
  })
  ret = JSON.stringify(ret);
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.end(ret);
});

function notFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>Not found :(.<h1>');
}

/*
funkcija za brisanje nekog elementa iz sadrzaja i onda redirektuje klijenta na home stranicu,
preporucljivo sacuvati backup verziju sadrzaj.json fajla pre nego sto pokusate ovo da ne morate
rucno da dopisujete izbrisan element 
*/
app.get('/brisi*' , function(req, res) {
  if (Object.keys(req.query).length === 0)
    notFound(req, res);
  var id = req.query.id;
  for (i = 0; i < sadrzaj.length; i ++){
    if (sadrzaj[i].id == id){
      console.log(sadrzaj.splice(i, 1));
      file.pisiUFajl(sadrzajFajl, sadrzaj);
    }
  }
  res.redirect("/");
});

/*
Funkcija koja nam vraca delove liste sadrzaj. Ako zahtev nema neki upit, vratice sve elemente
te liste. Ako smo vrsili pretragu, pozvace search() funkciju i poslati klijentu njenu 
povratnu vrednost 
*/
app.get('/sadrzaj', function (req, res) {
  var ret = null;
  if (Object.keys(req.query).length === 0)
    ret = JSON.stringify(sadrzaj);
  else
    ret = JSON.stringify(searchEngine.search(req.query, sadrzaj));
  
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.end(ret);  
});

// Svi ostali resursi, uglavnom se odnosi na slike.
app.get('/resources/*', function (req, res) {
  res.sendFile(req.path, { root: path.join(__dirname, '.') });
});

// Samo primjer POST metode.
app.post('/logintest/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user = searchEngine.findUser(username, password, korisnici);
  if (user) {
    res.writeHead(200, { "Content-Type": 'text/html' });
    res.end("Uspeli ste da se ulogujete kao " + user.username);
  }
  else {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('Niste uspeli da se ulogujete');
  }
});

/*
Funkcija koja prosledjuje podatke iz forme za izmenu i pise ih u fajl
*/
app.post('/izmena*', function (req, res) {
  var id = req.query.id
  for (i = 0; i < sadrzaj.length; i++) {
    if (sadrzaj[i].id == id) {
      sadrzaj[i].price = req.body.price;
      sadrzaj[i].title = req.body.header;
      file.pisiUFajl(sadrzajFajl, sadrzaj);
    }
  }
  res.redirect('/');
});
/*
Primer POST metode koja dovodi do dodavanja novog korisnika 
i redirektuje nazad na startnu stranicu
*/
app.post('/registertest/', function (req, res) {
  var noviKorisnik = new Object;
  noviKorisnik.ime = req.body.ime;
  noviKorisnik.sifra = req.body.sifra;
  noviKorisnik.id = korisnici.length;
  korisnici.push(noviKorisnik);
  file.pisiUFajl(korisniciFajl, korisnici);
  res.redirect("/");
});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)