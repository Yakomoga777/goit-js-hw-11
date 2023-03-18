// index
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//Посилання на елементи
const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

let page = 1;
let total = 0;
// console.log(btnLoadMoreEl)

//Викликаємо слухача
formEl.addEventListener('submit', onFormSubmit);
btnLoadMoreEl.addEventListener('click', onLoadMoreClick);

// Ініціалізація SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {});

// lightbox.on();
//=======================CALLBACKs================

//Функція SUBMIT
function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  const search = inputEl.value.trim();

  if (search) {
    clearMarkup();
    generateMarkup(search);
  } else
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
}

function onLoadMoreClick() {
  const search = inputEl.value.trim();
  page += 1;
  generateMarkup(search);
  // total += perPage;
  console.log(search);
}

//==============================FUNCTIONS===============
// Функція запиту на сервер
async function getPosts(search) {
  const key = '34395621-a4ae5341feaa95111ecdda581';

  const imageType = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  const perPage = 40;
  const URL = `https://pixabay.com/api/?key=${key}&q=${search}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&per_page=${perPage}&page=${page}`;
  // console.log(inputEl.value.trim());
  try {
    const response = await axios(URL);
    const data = response.data.hits;
    total += response.data.hits.length;
    if (data.length !== 0) {
      showLoadMoreBtn();
    }
    if (response.data.totalHits <= total || response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      hidesLoadMoreBtn();

      console.log(response.data.totalHits);
      console.log('Кнопка має бути прихованою');
    }

    console.log(total);
    console.log(response.data.totalHits);
    return data;
  } catch (error) {
  } finally {
    console.log('🧩');
  }
}

// Функція створення шаблону розмітки
function createMarkup(item) {
  return `<a href="${item.largeImageURL}" class="gallery__item"
        > <div class="card">
        <img src="${item.webformatURL}" alt="${item.tags}" class="gallery__image" loading="lazy" title=""
      />
       <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${item.downloads}
    </p>
  </div>
  </div>
      </a>
   `;
}
// Функція публікації розмітки
async function generateMarkup(search) {
  const data = await getPosts(search);
  const markup = data.reduce((acc, item) => {
    return acc + createMarkup(item);
  }, '');
  galleryEl.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
  return data;
}

// Функція очистки розмітки
function clearMarkup() {
  galleryEl.innerHTML = '';
}

function hidesLoadMoreBtn() {
  btnLoadMoreEl.classList.add('visually-hidden');
  console.log('кнопку ЗАХОВАЛИ ');
}
hidesLoadMoreBtn();

function showLoadMoreBtn() {
  btnLoadMoreEl.classList.remove('visually-hidden');
  console.log('кнопка ПОКАЗАЛАСЯ');
}

//******************************************************************************************* */
