import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const targetBox = document.querySelector('.observe-box');
const BASE_URL = 'https://pixabay.com/api/';
let counterOfPage = 0;

let lightbox = new SimpleLightbox('.gallery-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

function onSubmit(e) {
  e.preventDefault();
  galleryBox.innerHTML = '';
  const searchItem = searchInput.value;
  let observer = new IntersectionObserver(onLoad, options);

  if (!searchItem) {
    Notiflix.Notify.failure(`You have to write something in the search`);
    return;
  }

  async function getRequest() {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: '39900085-18543262e84803b81288c3331',
        q: searchItem,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: (counterOfPage += 1),
        per_page: 40,
      },
    });

    return response;
  }

  getRequest()
    .then(({ data: { hits, totalHits } }) => {
      if (hits.length === 0) {
        throw new Error();
      }
      observer.observe(targetBox);
      markup(hits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    })
    .catch(() =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );

  function onLoad(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        getRequest().then(({ data: { hits, totalHits } }) => {
          if (counterOfPage > totalHits / 40) {
            observer.unobserve(targetBox);
          }
          markup(hits);
          lightbox.refresh();
        });
      }
    });
  }
}

searchForm.addEventListener('submit', onSubmit);

function markup(arrayItem) {
  const markup = arrayItem
    .map(
      ({ tags, webformatURL, largeImageURL, views, downloads, likes, comments }) =>
        `<div class="photo-card">
            <a class="gallery-link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                    </p>
                </div>
            </a>
        </div>`
    )
    .join('');
  galleryBox.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 100 && !(document.activeElement === searchInput)) {
    searchForm.style.opacity = '0.8';
  } else {
    searchForm.style.opacity = '1';
  }
});
searchInput.addEventListener('focus', () => {
  searchForm.style.opacity = '1';
});
