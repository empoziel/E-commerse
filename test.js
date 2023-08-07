/*
fetch: request to api http
get:  get data
post: send data to server
put: update a data on the server
delete: deletes a data
*/

function getUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    // positive
    .then((response) => response.json())
    .then((data) => renderUsers(data))
    //negative
    .catch((error) => console.log(error));
}

//call the function and execute the request.
getUsers();

function renderUsers(users) {
  users.forEach((user) => document.write(user.name + "<br>"));
}
