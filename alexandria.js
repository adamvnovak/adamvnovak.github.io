document.getElementById("searchButton").addEventListener("click", searchBooks);

// async function searchBooks() {
//   const query = document.getElementById("search").value;
//   const url = `https://libgen-api.herokuapp.com/search/${query}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   displayResults(data);
// }

// function displayResults(books) {
//   const results = document.getElementById("results");
//   results.innerHTML = "";
//   books.forEach(book => {
//     const bookDiv = document.createElement("div");
//     bookDiv.classList.add("book");
//     bookDiv.innerHTML = `<h3>${book.title}</h3><p>Author: ${book.author}</p>`;
//     results.appendChild(bookDiv);
//   });
// }

async function searchBooks(query) {
  const url = `https://fathomless-wave-06104.herokuapp.com/https://libgen.lc/json.php?fields=Title,Author,Download&search=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  displayResults(data);
}

function displayResults(books) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  books.forEach(book => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    bookDiv.innerHTML = `<h3>${book.Title}</h3><p>Author: ${book.Author}</p>`;
    results.appendChild(bookDiv);
  });
}

// Example usage:
searchBooks("JavaScript");
