// Pretraga po naslovu.
function search(query, content) {
  var q = query.criteria.toLowerCase();
  return content.filter(function (elem) {
    return elem.title.toLowerCase().includes(q);
  })
}

// Pretraga prilikom prijave na sistem.
function findUser(username, password, users) {
  return users.find(function(elem) {
    return elem.username === username && elem.password === password;
  });
}

// Pretraga korisnickih imena prilikom registracije.
function checkIfUserExists(username, users) {
  return users.find(function(elem) {
    return elem.username === username;
  });
}

module.exports = {
  search: search,
  findUser: findUser,
  checkIfUserExists: checkIfUserExists
}