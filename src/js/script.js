import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const BASE_URL =
  'https://pixabay.com/api/?key=39900085-18543262e84803b81288c3331';

function markup(arrayItem) {
  const markup = arrayItem
    .map(
      ({
        tags,
        webformatURL,
        largeImageURL,
        views,
        downloads,
        likes,
        comments,
      }) =>
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
}

function onSubmit(e) {
  e.preventDefault();
  const searchItem = searchInput.value;

  async function getRequest(item) {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: item,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    return response;
  }

  getRequest(searchItem)
    .then(({ data: { hits } }) => {
      if (hits.length === 0) {
        throw new Error();
      }

      markup(hits);
    })
    .catch(() =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

searchForm.addEventListener('submit', onSubmit);
new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
