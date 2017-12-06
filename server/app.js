var fs = require('fs');
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
var usersFile = "./files/users.json";
var contentFile = "./files/content.json";

var users = file.readFromFile(usersFile);
var sadrzaj = file.readFromFile(contentFile);

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

app.post('/re')

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

// Stranica pojedinacnog entiteta.
app.get('/element', function(req, res) {
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
app.delete('/remove' , function(req, res) {
  if (Object.keys(req.query).length === 0)
    notFound(req, res);
  var id = req.query.id;
  for (i = 0; i < sadrzaj.length; i ++){ // Moze se koristiti findIndex funkcija umesto petlje.
    if (sadrzaj[i].id == id){
      sadrzaj.splice(i, 1);
      file.writeToFile(contentFile, sadrzaj);
    }
  }
  res.writeHead(204, { 'Content-Type': 'text/html' });
  res.end();
});

/*
Funkcija koja nam vraca delove liste sadrzaj. Ako zahtev nema neki upit, vratice sve elemente
te liste. Ako smo vrsili pretragu, pozvace search() funkciju i poslati klijentu njenu 
povratnu vrednost 
*/
app.get('/content', function (req, res) {
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

// Primjer POST metode. U HTML kodu pogledati kako se salje zahtev.
app.post('/login/', function (req, res) { // Na jedan endpoint se mogu slati razliciti zahtevi: GET, POST...
  var username = req.body.username;
  var password = req.body.password;
  var user = searchEngine.findUser(username, password, users);
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
Funkcija koja dobavlja formu za editovanje entiteta. Potom se iz te forme traze podaci.
*/
app.get('/edit', function (req, res) {
  var html = fs.readFileSync("./templates" + req.path + ".html");
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
})

/*
Funkcija koja prosledjuje podatke iz forme za izmenu i pise ih u fajl.
Koristi se PUT metoda.
*/
app.put('/edit', function (req, res) {
  var id = req.query.id
  for (i = 0; i < sadrzaj.length; i++) {
    if (sadrzaj[i].id == id) {
      sadrzaj[i].price = req.body.price;
      sadrzaj[i].title = req.body.title;
      sadrzaj[i].image = req.body.image;
      file.writeToFile(contentFile, sadrzaj);
      break;
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end();
});

/*
Primer POST metode koja dovodi do dodavanja novog korisnika 
i redirektuje nazad na startnu stranicu
*/
app.post('/register/', function (req, res) {
  var newUser = new Object(); // I ovaj nacin pravljenja objekata; sematika kao varnewUser = {};
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.id = users.length;
  if (searchEngine.checkIfUserExists(newUser.username, users)) {
    res.writeHead(409, { 'Content-Type': 'text/html' }); // Kod 409 oznacava konflikt. Moze i 412.
    res.end('Korisnik vec postoji!');
  }
  else {
    users.push(newUser);
    file.writeToFile(usersFile, users);
    // res.writeHead(201, {'Content-Type': 'text/html'}); // Kod 201 ozancava created.
    // res.end();
    res.redirect("/"); // Primjer redirekcije. Ovo iznad ima vise smisla, posto bi trebalo da vratimo neki kod.
  }
});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)