function createSubmenuHTML(item) {
  return `
    <li><a href="./specific_category.html" data-category="${item.slug}">${item.name}</a></li>
  `;
}
const specialCategories = document.querySelector('.submenu #special-categories');
fetch({
  type: 'GET',
  url: 'http://127.0.0.1:8000/categories/',
  dataType: 'json'
})
.then(response => response.json())
.then(data => {
  specialCategories.innerHTML = ''; // clear the container
  data.results.forEach((item) => {
    specialCategories.innerHTML += createSubmenuHTML(item);
  });
})
.catch(error => {
  fetch('http://127.0.0.1:5500/locally/allCategory.json')
    .then(response => response.json())
    .then(json => {
      specialCategories.innerHTML = ''; // clear the container
      json.results.forEach((item) => {
        specialCategories.innerHTML += createSubmenuHTML(item);
      });
    })
});

document.addEventListener('DOMContentLoaded', function() {
  const footerList = document.querySelector('.footer-list');
  fetch('http://127.0.0.1:8000/categories/')
    .then(response => response.json())
    .then(data => {
      const newItems = data.results.map(item => {
        return `
          <li><a href="./specific_category.html" data-category="${item.slug}">${item.name}</a></li>
        `;
      });
      footerList.innerHTML = '';
      footerList.innerHTML += `
        <li class=""><a href="">Про нас</a></li>
        <li class=""><a href="">Історії</a></li>
        ${newItems.join('')}
        <li class=""><a href="">Корисні посилання</a></li>
      `;
    })
    .catch(error => {
      fetch('http://127.0.0.1:5500/locally/allCategory.json')
        .then(response => response.json())
        .then(json => {
          const newItems = json.results.map(item => {
            return `
              <li><a href="./specific_category.html" data-category="${item.slug}">${item.name}</a></li>
            `;
          });
          footerList.innerHTML = '';
          footerList.innerHTML += `
            <li class=""><a href="">Про нас</a></li>
            <li class=""><a href="">Історії</a></li>
            ${newItems.join('')}
            <li class=""><a href="">Корисні посилання</a></li>
          `;
        })
    });
});