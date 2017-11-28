function search(query, content) {
  var q = query.criteria.toLowerCase();
  return content.filter(function (elem) {
    return elem.title.toLowerCase().includes(q);
  })
}

function findUser(username, password, users) {
  return users.find(function(elem) {
    return elem.username === username && elem.password === password;
  });
}

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