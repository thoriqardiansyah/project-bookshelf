const books = [];
const data = [];
const RENDER = "RENDER";
const STORAGE_KEY = "BOOK_KEY";
const SAVED_DATA = "SAVED";

const findBookIndex = (bookId) => {
  for (let index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
};

const findBook = (bookId) => {
  for (let bookIndex of books) {
    if (bookIndex.id === bookId) {
      return bookIndex;
    }
  }
  return null;
};

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const resetFields = () => {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("isComplete").checked = false;
};

const deleteBook = (bookId) => {
  const targetBook = findBookIndex(bookId);
  if (targetBook === -1) return;
  const confirmDelete = confirm("Are you sure want to delete this?");
  if (confirmDelete) books.splice(targetBook, 1);
  document.dispatchEvent(new Event(RENDER));
  saveData();
};

const checkedBook = (bookId) => {
  const bookTarget = findBook(bookId);
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER));
  saveData();
};

const undoBook = (bookId) => {
  const bookTarget = findBook(bookId);
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER));
  saveData();
};

const editBook = (bookId) => {
  const bookTarget = findBook(bookId);
  const bookTargetId = findBookIndex(bookId);
  books.splice(bookTargetId, 1);
  document.getElementById("title").value = bookTarget.title;
  document.getElementById("author").value = bookTarget.author;
  document.getElementById("year").value = bookTarget.year;
  document.getElementById("isComplete").checked = bookTarget.isComplete;

  document.dispatchEvent(new Event(RENDER));
  saveData();
};

const addBook = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value);
  const isComplete = document.getElementById("isComplete").checked;
  const generateId = +new Date();
  const bookObject = generateBookObject(
    generateId,
    title,
    author,
    year,
    isComplete
  );

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER));
  saveData();
};

const makeBook = (bookObject) => {
  const textTitle = document.createElement("h4");
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  const numYear = document.createElement("p");
  numYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, numYear);

  const container = document.createElement("div");
  container.classList.add("item", "card");
  container.append(textContainer);
  container.setAttribute("id", `bookId-${bookObject.id}`);

  if (bookObject.isComplete) {
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => {
      editBook(bookObject.id);
    });

    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-btn");
    undoButton.addEventListener("click", () => {
      undoBook(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    container.append(editButton, undoButton, deleteButton);
  } else {
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => {
      editBook(bookObject.id);
    });

    const checkedButton = document.createElement("button");
    checkedButton.classList.add("checked-btn");
    checkedButton.addEventListener("click", () => {
      checkedBook(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    container.append(editButton, checkedButton, deleteButton);
  }
  return container;
};

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung web storage!!!");
    return false;
  }
  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const dataString = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, dataString);
  }
};

const loadData = () => {
  const dataStorage = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(dataStorage);

  if (data !== null) {
    for (const dataItem of data) {
      books.push(dataItem);
    }
  }

  document.dispatchEvent(new Event(RENDER));
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    resetFields();
  });

  if (isStorageExist()) {
    loadData();
  }

  document.dispatchEvent(new Event(RENDER));
});

const filter = (input) => {
  books.filter((item) => {
    if (item.title.toLowerCase().includes(input.toLowerCase())) {
      data.push(item);
    }
  });
};

const searchButton = document.getElementById("buttonSearch");
const inputSearch = document.getElementById("searchBookTitle");
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const input = inputSearch.value;
  input === "" ? location.reload() : filter(input);

  document.dispatchEvent(new Event(RENDER));
});

document.addEventListener(RENDER, () => {
  const unFinishedRead = document.getElementById("unFinishedRead");
  unFinishedRead.innerHTML = "";
  const finishedRead = document.getElementById("finishedRead");
  finishedRead.innerHTML = "";

  if (data.length === 0) {
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      bookItem.isComplete === false
        ? unFinishedRead.append(bookElement)
        : finishedRead.append(bookElement);
    }
  } else {
    data.map((book) => {
      const bookElement = makeBook(book);
      book.isComplete === false
        ? unFinishedRead.append(bookElement)
        : finishedRead.append(bookElement);
    });
  }
});
