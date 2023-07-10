const resultsContainer = document.querySelector("#resultado");
const form = document.querySelector("#formulario");
const paginationContainer = document.querySelector("#paginacion");

const resultsPerPage = 30;
let totalPages;
let iterator;
let currentPage = 1;

window.addEventListener("load", (e) => {
  form.addEventListener("submit", validateForm);
});

function validateForm(e) {
  e.preventDefault();

  const searchInput = document.querySelector("#termino");
  const searchInputValue = searchInput.value.trim();

  if (searchInputValue === "") {
    showAlert("Please make a valid search");
    return;
  }

  searchImages();
}

function showAlert(msg) {
  const alertExist = document.querySelector(".bg-red-100");

  if (!alertExist) {
    const alert = document.createElement("P");
    alert.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "text-center", "max-w-lg", "mx-auto", "mt-6");

    alert.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">${msg}</span>
    `;

    form.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
  }
}

async function searchImages() {
  const query = document.querySelector("#termino").value.trim();

  const API_KEY = "38148669-07b7fcb70ef5e4d143b114404";
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&per_page=${resultsPerPage}&page=${currentPage}`;

  try {
    const response = await fetch(URL);
    const { hits, totalHits } = await response.json();
    totalPages = calculatePages(totalHits);
    showCards(hits);
  } catch (error) {
    console.log(error);
  }
}

function showCards(images = []) {

  clearHtml(resultsContainer);

  images.forEach(img => {
    const { previewURL, likes, views, largeImageURL } = img;

    resultsContainer.innerHTML += `
      <div class="w-1/2 sm:w-1/3 lg:w-1/4 p-3 mb-4">
        <div class="bg-white rounded">
          <img src="${previewURL}" class="w-full" />
          <div class="p-4">
            <p class="font-bold">${likes} <span class="font-light">Likes</span> </p>
            <p class="font-bold">${views} <span class="font-light">Views</span> </p>
            <a
              href="${largeImageURL}"
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full bg-blue-800 hover:bg-blue-500 text-white font-bold uppercase text-center rounded mt-5 p-1"
            >
              View Full Img
            </a>
          </div>
        </div>
      </div>
    `;

    clearHtml(paginationContainer);

    printPaginator();

  });
}

function printPaginator() {
  iterator = createPaginator(totalPages);

  while (true) {
    const { value, done } = iterator.next();

    if (done) return;

    // create a button on each iteraction
    const btn = document.createElement("a");
    btn.href = "#";
    btn.dataset.page = value;
    btn.textContent = value;
    btn.classList.add("next", "bg-yellow-300", "px-4", "py-1", "mx-2", "font-bold", "mb-4", "rounded");

    btn.onclick = () => {
      currentPage = value;
      searchImages();
    }

    paginationContainer.appendChild(btn);
  }
}

// Generator
function* createPaginator(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calculatePages(total) {
  return parseInt(Math.ceil(total / resultsPerPage));
}

function clearHtml(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}