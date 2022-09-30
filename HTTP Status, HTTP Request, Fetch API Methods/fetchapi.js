//basic fetch request example
// fetch("http://example.com/movies.json")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// getUsers() function that fetches users.json from the server
async function getUsers() {
  let url = "http://example.com/movies.json";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
