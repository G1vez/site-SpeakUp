function createCardHTML(item, index) {
  return `
    <div class="card">
      <figure>
        <a href="">
          <img ${index === 0 ? 'id="square"' : ''} src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="" class="article-text black">${item.title}</a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}
const cardsContainer = document.getElementById('cards-container');
fetch('http://127.0.0.1:8000/articles/')
  .then(response => response.json())
  .then(data => {
    cardsContainer.innerHTML = ''; // clear the container
    data.results.forEach((item, index) => {
      cardsContainer.innerHTML += createCardHTML(item, index);
  });
})
.catch(error => {
  fetch('./locally/podojg.json')
    .then(response => response.json())
    .then(json => {
      cardsContainer.innerHTML = ''; // clear the container
      json.results.forEach((item, index) => {
        cardsContainer.innerHTML += createCardHTML(item, index);
      });
    })
});