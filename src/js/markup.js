export function createMarkup(arrayItem) {
  const marking = arrayItem.map(
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
  );

  return marking.join('');
}
