function createCardHTML(item) {
  return `
    <div class="card">
      <figure>
        <a href="">
          <img src="${item.image_url}" alt="${item.title}">
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
fetch({
  type: 'GET',
  url: 'http://127.0.0.1:8000/articles/',
  dataType: 'json'
})
.then(response => response.json())
.then(data => {
  cardsContainer.innerHTML = ''; // clear the container
  data.results.forEach(item => {
    cardsContainer.innerHTML += createCardHTML(item);
  });
})
.catch(error => {
  fetch('http://127.0.0.1:5500/locally/podojg.json')
    .then(response => response.json())
    .then(json => {
      cardsContainer.innerHTML = ''; // clear the container
      json.results.forEach(item => {
        cardsContainer.innerHTML += createCardHTML(item);
      });
    })
});