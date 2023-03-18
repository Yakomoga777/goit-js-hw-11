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
  clearMarkup();
  generateMarkup();
  showLoadMoreBtn();
}

function onLoadMoreClick() {
  page += 1;
  generateMarkup();
  // total += perPage;
  // console.log(total);
}

//==============================FUNCTIONS===============
// Функція запиту на сервер
async function getPosts() {
  const key = '34395621-a4ae5341feaa95111ecdda581';
  const search = inputEl.value;
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  const perPage = 40;

  try {
    const response = await axios(
      `https://pixabay.com/api/?key=${key}&q=${search}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&per_page=${perPage}&page=${page}`
    );
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      total += response.data.hits.length;

      if (response.data.totalHits <= total) {
        hidesLoadMoreBtn();
      }
    }

    console.log(total);
    console.log(response.data.totalHits);
    return response.data.hits;
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
  //  `<div class="photo-card">
  //   <img src="${item.previewURL}" alt="${item.tags}" loading="lazy" />
  //   <div class="info">
  //     <p class="info-item">${item.likes}
  //       <b>Likes</b>
  //     </p>
  //     <p class="info-item">${item.views}
  //       <b>Views</b>
  //     </p>
  //     <p class="info-item">${item.comments}
  //       <b>Comments</b>
  //     </p>
  //     <p class="info-item">${item.downloads}
  //       <b>Downloads</b>
  //     </p>
  //   </div>

  // </div>`;
}
// Функція публікації розмітки
async function generateMarkup() {
  const data = await getPosts();
  const markup = data.reduce((acc, item) => {
    return acc + createMarkup(item);
  }, '');
  galleryEl.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

// Функція очистки розмітки
function clearMarkup() {
  galleryEl.innerHTML = '';
}

function hidesLoadMoreBtn() {
  btnLoadMoreEl.classList.add('visually-hidden');
}
hidesLoadMoreBtn();

function showLoadMoreBtn() {
  btnLoadMoreEl.classList.remove('visually-hidden');
}
// Плавне прокручування
