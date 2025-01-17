let myLibrary = [];
const addBtn = document.querySelector("#add-book");
const bookForm = document.querySelector("#bookForm");
const overlay = document.querySelector("#overlay");
const newBookForm = document.querySelector("#bookForm");
const booksFromLocalStorage = JSON.parse(localStorage.getItem("myLibrary"));
let booksReadTotal = document.querySelector("#books-read");
let pagesReadTotal = document.querySelector("#pages-read");

if (booksFromLocalStorage) {
    myLibrary = booksFromLocalStorage.map(book => new Book(book.title, book.author, book.pages, book.read));
    render();
}

addBtn.addEventListener('click', addBookRequest);

overlay.addEventListener("click", function(event) {
    if (event.target === this) {
        closeForm();
        clearFormFields();
    }
});

bookForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addBookToLibrary();
})

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
}

function toggleRead(index) {
    myLibrary[index].toggleRead();
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    render();
}

function addBookRequest() {
    overlay.style.display = 'block';
    newBookForm.style.display = 'block';

    requestAnimationFrame( () => {
        overlay.style.opacity = '1';
        newBookForm.style.opacity = '1';
    });
}

function addBookToLibrary() {
    let title = document.querySelector("#title").value; 
    let author = document.querySelector("#author").value;
    let pages = document.querySelector("#pages").value;
    let read = document.querySelector("#read").checked; 
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    render();
    closeForm();
    clearFormFields();
}

function clearFormFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#pages").value = "";
    document.querySelector("#read").checked = false;
}

function render() {
    let libraryEl = document.querySelector("#library");
    libraryEl.innerHTML = "";

    booksRead = 0;
    pagesRead = 0;

    for (let i = 0; i < myLibrary.length; i++) {
        let book = myLibrary[i];
        let bookEl = document.createElement("div");
        bookEl.innerHTML = `
        <div id="card">
            <button class="remove-btn" onclick="removeBook(${i})">X</button>
            <div id="book-title"><span style="font-weight: 600;">Title:</span> ${book.title}</div>
            <div id="book-author"><span style="font-weight: 600;">Author:</span> ${book.author}</div>
            <div id="book-pages"><span style="font-weight: 600;">Pages:</span> ${book.pages}</div>
            <button class="book-read ${book.read ? 'read' : 'not-read'}" onclick="toggleRead(${i})">${book.read ? "Read": "Not Read Yet"}</button>
        </div>`
        libraryEl.appendChild(bookEl);

        booksRead++;
        pagesRead+= parseInt(book.pages, 10);
    }

    booksReadTotal.innerHTML = `<span style="font-weight: 600;">Total Books:</span> ${booksRead}`;
    pagesReadTotal.innerHTML = `<span style="font-weight: 600;">Total Pages:</span> ${pagesRead}`;
}


function removeBook(index) {
    myLibrary.splice(index, 1);
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    render(); 
}

function closeForm() {
    overlay.style.opacity = '0';
    newBookForm.style.opacity = '0';

    setTimeout(() => {
        overlay.style.display = 'none';
        newBookForm.style.display = 'none';
    }); 
}

// validation
pages.addEventListener('input', (event) => {
    if (!pages.value.trim()) {
        pages.setCustomValidity("This field cannot be empty!");
    } else if (isNaN(pages.value) || parseInt(pages.value, 10) <= 0) {
        pages.setCustomValidity("Please enter a valid number greater than 0!");
    } else {
        pages.setCustomValidity("");
    }
    pages.reportValidity();
});
