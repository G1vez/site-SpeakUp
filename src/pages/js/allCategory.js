function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

function createSubmenuHTML(item, lang) {
  return `
    <li><a href="/${getShortLang(lang)}/categories/${item.slug}" data-category="${item.slug}">${item.name}</a></li>
  `;
}

function createSubmenuHTML2(item) {
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
          // Отримуємо поточну мову
    const lang = localStorage.getItem('language') || 'uk-UA';
      categoriesContainer.innerHTML += createSubmenuHTML(item, lang);
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

document.addEventListener('DOMContentLoaded', function() {
  const footerList = document.querySelector('.footer-list');
  fetchCategories()
      .then(data => {
          const newItems = data.results.map(item => {
              return createSubmenuHTML2(item);
          });
          footerList.innerHTML = ''; // Очищаємо футер
          footerList.innerHTML += `
              <li><a href="/about" class="content" data-key="about"></a></li>
              <li><a href="/stories" class="content" data-key="stories">Історії</a></li>
              ${newItems.join('')}
              <li><a href="/useful-links" class="content" data-key="useful_links"></a></li>
          `;

          // Оновлюємо посилання у футері після вставки HTML
          const currentLang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо поточну мову
          updateFooterLinks(currentLang);

          // Оновлюємо контент футера
          const dictionary = {}; // Отримайте словник для поточної мови
          loadLanguage(currentLang).then(dict => {
              updateContent(dictionary); // Оновлюємо контент
          });
      })
      .catch(error => {
          console.error('Помилка при отриманні категорій:', error);
      });
});


function openNav() {
  document.getElementById("myNav").style.display = "block";
}

function closeNav() {
  document.getElementById("myNav").style.display = "none";
}