import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//знаходження елементів
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};
//оголошення поточної сторінки
let currentPage = 1;
//додавання класу .hide до кнопки підвантаження нових картинок
refs.loadBtn.classList.add('hide');
// навішування слухачів подій
refs.form.addEventListener('submit', loadPicures);
refs.loadBtn.addEventListener('click', loadPicures);
//функція завантаження картинок
async function loadPicures(e) {
  //відміна перезавантаження сторінки при сабміті
  e.preventDefault();
  //збір введеного значення
  const query = refs.form.elements.searchQuery.value.trim();

  if (!query) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  //отримання результатів пошуку картинок, формат об'єкту з властивостями total, totalHits, hits
  const searchResult = await getPictures(query);
  //перевірка на пустий об'єкт
  if (!searchResult.hits.length) {
    //повідомлення про те, що результатів не знайдено
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  //перевірка події, якщо сабміт - очистити розмітку
  if (e.type === 'submit') {
    currentPage = 1;
    clearMarkup();
    //повідомлення про загальну кількість знайдених картинок
    Notify.info(`Hooray! We found ${searchResult.totalHits} images.`);
  }

  //перевірка, що прийшов масив
  if (searchResult.hits) {
    //генерація розмітки
    const markup = createMarkup(searchResult.hits);
    //вставка розмітки
    insertMarkup(markup);
    //плавне прокручування
    if (e.type === 'click') {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
    //ініціалізація лайтбокса
    const lightbox = new SimpleLightbox('.gallery a');
    //робить кнопку підвантаження картинок видимою
    refs.loadBtn.classList.remove('hide');
    //збільшення значення поточної сторінки
    currentPage += 1;

    lightbox.refresh();
  }
  //перевірка кількості сторінок, приховання кнопки завантаження картинок
  if (currentPage > Math.ceil(searchResult.totalHits / 40)) {
    refs.loadBtn.classList.add('hide');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
//фетч картинок
async function getPictures(query) {
  const KEY = '34375479-0be71e9ee085bc26f1477b7fd';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
  try {
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
//створення розмітки
function createMarkup(array) {
  return array.reduce(
    (acc, item) =>
      acc +
      `
  <a href="${item.largeImageURL}" class="gallery__item">
        <div class="photo-card">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" class="gallery__image"/>
          <div class="info">
            <p class="info-item">
              <b>Likes: ${item.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${item.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${item.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${item.downloads}</b>
            </p>
          </div>
        </div>
      </a>
  `,
    ''
  );
}
//вставка розмітки
function insertMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', data);
}
//очищення розмітки
function clearMarkup() {
  refs.gallery.innerHTML = '';
}
