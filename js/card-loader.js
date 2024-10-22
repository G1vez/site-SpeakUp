function createCardHTML(item, index) {
  return `
    <div class="card">
      <figure>
        <a href="${item.detail_url}">
          <img ${index === 0 ? 'id="square"' : ''} src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="${item.detail_url}" class="article-text black">${item.title}</a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}
const cardsContainer = document.getElementById('cards-container');
fetch('https://speakup.in.ua/api/articles/')
  .then(response => response.json())
  .then(data => {
    cardsContainer.innerHTML = ''; // clear the container
    data.results.forEach((item, index) => {
      cardsContainer.innerHTML += createCardHTML(item, index);
  });
})
.catch(error => {
  fetch('https://speakup.in.ua/api/articles/')
    .then(response => response.json())
    .then(json => {
      cardsContainer.innerHTML = ''; // clear the container
      json.results.forEach((item, index) => {
        cardsContainer.innerHTML += createCardHTML(item, index);
      });
    })
});