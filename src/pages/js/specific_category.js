// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/');
const slug = segments.pop(); // Отримуємо slug

// Формуємо URL для API
const apiUrl = `https://speakup.in.ua/api/articles/by-category/${slug}/`;

function createCardHTML(item) {
  const slug = item.detail_url.split('/').slice(-2, -1)[0];

  return `
    <div class="card">
      <figure>
        <a href="/articles/${slug}">
          <img src="${item.image_url}" alt="${item.title}">
        </a>
      </figure>
      <div>
        <a href="/articles/${slug}" class="article-text black">${item.title}</a>
        <div class="gray text-card">${item.intro}</div>
      </div>
    </div>
  `;
}

// Виконуємо запит до API
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const articles = data.results; // Витягуємо масив статей з поля results
    const container = document.getElementById('cards-container'); // Змінити на ваш контейнер
    articles.forEach(item => {
      const cardHTML = createCardHTML(item);
      container.innerHTML += cardHTML; // Додаємо картки в контейнер
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });


  // Формуємо URL для запиту до API категорій
const categoriesApiUrl = 'https://speakup.in.ua/api/categories/';

// Виконуємо запит до API категорій
fetch(categoriesApiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const category = data.results.find(item => item.slug === slug); // Знаходимо категорію за slug
    if (category) {
      // Вставляємо назву категорії в h1 та в елемент з класом "title"
      document.querySelector('h2').innerText = category.name;
      document.querySelector('.title').innerText = category.name;
    } else {
      console.error('Категорію не знайдено');
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });