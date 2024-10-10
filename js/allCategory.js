function createSubmenuHTML(item) {
  return `
    <li><a href="./categories/${item.slug}" data-category="${item.slug}">${item.name}</a></li>
  `;
}

window.onload = function() {
  const specialCategories = document.getElementById('special-categories');
  fetchCategories()
    .then(data => {
      specialCategories.innerHTML = ''; // clear the container
      data.results.forEach((item) => {
        specialCategories.innerHTML += createSubmenuHTML(item);
      });
    })
    .catch(error => {
      fetchLocalCategories()
        .then(json => {
          specialCategories.innerHTML = ''; // clear the container
          json.results.forEach((item) => {
            specialCategories.innerHTML += createSubmenuHTML(item);
          });
        });
    });
};

document.addEventListener('DOMContentLoaded', function() {
  const footerList = document.querySelector('.footer-list');
  fetchCategories()
    .then(data => {
      const newItems = data.results.map(item => {
        return `
          <li><a href="./categories/${item.slug}" data-category="${item.slug}">${item.name}</a></li>
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
      fetchLocalCategories()
        .then(json => {
          const newItems = json.results.map(item => {
            return `
              <li><a href="./categories/${item.slug}" data-category="${item.slug}">${item.name}</a></li>
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

// Helper functions
function fetchCategories() {
  return fetch('./categories/')
    .then(response => response.json());
}

function fetchLocalCategories() {
  return fetch('./categories/categoryList.json')
    .then(response => response.json());
}