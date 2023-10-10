import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { createMarkup } from './markup.js';
import { getRequest } from './pixabay-api.js';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const targetBox = document.querySelector('.observe-box');

let searchItem = '';
let page = 1;

let lightbox = new SimpleLightbox('.gallery-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      getRequest(searchItem, (page += 1)).then(
        ({ data: { hits: arrayCards, totalHits: totalCards } }) => {
          if (page > Math.ceil(totalCards / 40)) {
            observer.unobserve(targetBox);
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          }

          const markup = createMarkup(arrayCards);
          galleryBox.insertAdjacentHTML('beforeend', markup);

          lightbox.refresh();
        }
      );
    }
  });
}

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  galleryBox.innerHTML = '';

  searchItem = searchInput.value;

  if (!searchItem) {
    Notiflix.Notify.failure(`You have to write something in the search`);
    return;
  }

  getRequest(searchItem, page)
    .then(({ data: { hits: arrayCards, totalHits: totalCards } }) => {
      if (arrayCards.length === 0) {
        throw new Error();
      }

      const markup = createMarkup(arrayCards);
      galleryBox.insertAdjacentHTML('beforeend', markup);

      Notiflix.Notify.success(`Hooray! We found ${totalCards} images.`);

      lightbox.refresh();

      observer.observe(targetBox);
    })

    .catch(err => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      console.log(err);
    });
}
searchForm.addEventListener('submit', onSubmit);

// mini-style for form

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
