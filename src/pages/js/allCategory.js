function createSubmenuHTML(item) {
  return `
    <li><a href="/categories/${item.slug}" data-category="${item.slug}">${item.name}</a></li>
  `;
}

window.onload = function() {
  const specialCategories = document.getElementById('special-categories');
  fetchCategories()
    .then(data => {
      specialCategories.innerHTML = ''; // очищаємо контейнер
      data.results.forEach((item) => {
        specialCategories.innerHTML += createSubmenuHTML(item);
      });
    })
    .catch(error => {
      console.error('Помилка при отриманні категорій:', error);
      fetchLocalCategories()
        .then(json => {
          specialCategories.innerHTML = ''; // очищаємо контейнер
          json.results.forEach((item) => {
            specialCategories.innerHTML += createSubmenuHTML(item);
          });
        })
        .catch(localError => {
          console.error('Помилка при отриманні локальних категорій:', localError);
        });
    });
};

document.addEventListener('DOMContentLoaded', function() {
  const footerList = document.querySelector('.footer-list');
  fetchCategories()
    .then(data => {
      const newItems = data.results.map(item => {
        return createSubmenuHTML(item);
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
      console.error('Помилка при отриманні категорій:', error);
    });
});

// Helper functions
function fetchCategories() {
  return fetch('https://speakup.in.ua/api/categories/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}