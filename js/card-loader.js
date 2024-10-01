function createCardHTML(item) {
  return `
    <figure>
      <a href=" ">
        <img src="${item.image_url}" alt="${item.title}">
      </a>
    </figure>
    <div>
      <a href=" " class="article-text black">${item.title}</a>
      <div class="gray text-card">${item.intro}</div>
    </div>
  `;
}

fetch({
  type: 'GET',
  url: 'http://127.0.0.1:8000/articles/',
  dataType: 'json'
})
.then(response => response.json())
.then(data => {
  data.forEach(item => {
    cardsContainer.innerHTML += createCardHTML(item);
  });
})
.catch(error => {
  fetch('http://localhost:8000/podojg.json')
    .then(response => response.json())
    .then(json => {
      json.forEach(item => {
        cardsContainer.innerHTML += createCardHTML(item);
      });
    });
});