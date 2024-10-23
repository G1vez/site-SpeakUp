// const routes = {
//     '/articles/(.*)': {
//       template: 'article.html',
//       script: 'single-article.js',
//     },
//   };
  
// const router = () => {
// const url = window.location.pathname;
// const routeRegex = Object.keys(routes).find(key => new RegExp(key).test(url));
// if (routeRegex) {
//     const route = routes[routeRegex];
//     const articleID = url.match(new RegExp(routeRegex))[1];
//     fetch(templateHtml)
//     .then(response => response.text())
//     .then(html => {
//         const template = Handlebars.compile(html);
//         const data = {
//         articleID,
//         // Add more data here
//         };
//         const renderedHtml = template(data);
//         document.body.innerHTML = renderedHtml;
//     });
//     fetch(scriptUrl)
//     .then(response => response.text())
//     .then(script => {
//         const scriptTemplate = Handlebars.compile(script);
//         const renderedScript = scriptTemplate({ articleID });
//         const scriptTag = document.createElement('script');
//         scriptTag.textContent = renderedScript;
//         document.body.appendChild(scriptTag);
//     });
// } else {
//     console.error(`Route not found: ${url}`);
// }
// };

// window.addEventListener('popstate', router);
// router();

function createCardHTML(item) {
    return `
      <div class="card">
        <figure>
          <a href="${item.detail_url}">
            <img src="${item.image_url}" alt="${item.title}">
          </a>
        </figure>
        <div>
          <div class="content-text-bold text-card">${item.intro}</div>
          <a href="${item.detail_url}" class="article-text black">${item.title}</a>
        </div>
      </div>
    `;
  }
  const cardsContainer = document.getElementById('cards-container');
  fetch('https://speakup.in.ua/api/articles/')
    .then(response => response.json())
    .then(data => {
      cardsContainer.innerHTML = ''; // clear the container
      data.results.forEach((item) => {
        cardsContainer.innerHTML += createCardHTML(item);
    });
  })
  .catch(error => {
    fetch('./articles/articleList.json')
      .then(response => response.json())
      .then(json => {
        cardsContainer.innerHTML = ''; // clear the container
        json.results.forEach((item) => {
          cardsContainer.innerHTML += createCardHTML(item);
        });
      })
  });