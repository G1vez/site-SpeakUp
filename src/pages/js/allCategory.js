function createSubmenuHTML(item) {
  return `
    <li><a href="/categories/${item.slug}" data-category="${item.slug}">${item.name}</a></li>
  `;
}

window.onload = function() {
  const specialCategoriesList = document.querySelectorAll('.special-categories'); // Отримуємо всі елементи з класом 'special-categories'

  // Функція для оновлення категорій
  const updateCategories = (categoriesContainer, data) => {
    categoriesContainer.innerHTML = ''; // очищаємо контейнер
    data.results.forEach((item) => {
      categoriesContainer.innerHTML += createSubmenuHTML(item);
    });
  };

  fetchCategories()
    .then(data => {
      specialCategoriesList.forEach((specialCategories) => {
        updateCategories(specialCategories, data); // Оновлюємо категорії для кожного елемента
      });
    })
    .catch(error => {
      console.error('Помилка при отриманні категорій:', error);
      fetchLocalCategories()
        .then(json => {
          specialCategoriesList.forEach((specialCategories) => {
            updateCategories(specialCategories, json); // Оновлюємо локальні категорії для кожного елемента
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
        <li><a href="/about">Про нас</a></li>
        <li><a href="/stories">Історії</a></li>
        ${newItems.join('')}
        <li><a href="/useful-links">Корисні посилання</a></li>
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


function openNav() {
  document.getElementById("myNav").style.display = "block";
}

function closeNav() {
  document.getElementById("myNav").style.display = "none";
}