// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/');
const slug = segments.pop(); // Отримуємо slug

// Формуємо URL для API
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо мову з localStorage
const apiUrl = `https://speakup.in.ua/api/articles/by-category/${slug}/`;

function getShortLang(lang) {
  return lang.split('-')[0]; // Отримуємо короткий код мови
}

// Функція для створення HTML картки статті
function createCardHTML(item) {
    const articleSlug = item.detail_url.split('/').slice(-2, -1)[0]; // Отримуємо slug статті

    return `
        <div class="card">
            <figure>
                <a href="/${getShortLang(lang)}/articles/${articleSlug}">
                    <img src="${item.image_url}" alt="${item.title}">
                </a>
            </figure>
            <div>
                <a href="/${getShortLang(lang)}/articles/${articleSlug}" class="article-text black">
                    ${item.title}
                </a>
                <div class="gray text-card">${item.intro}</div>
            </div>
        </div>
    `;
}

async function fetchArticles(language) {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept-Language': language
            }
        });

        if (!response.ok) {
            console.error('Помилка при отриманні карток:', response.statusText);
            return;
        }
        const data = await response.json();
        const articles = data.results; // Витягуємо масив статей з поля results
        const container = document.getElementById('cards-container'); // Змінити на ваш контейнер
        container.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток
        articles.forEach(item => {
            const cardHTML = createCardHTML(item);
            container.innerHTML += cardHTML; // Додаємо картки в контейнер
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
fetchArticles(lang);

// Функція для отримання категорій
async function fetchCategories(language) {
    try {
        const response = await fetch('https://speakup.in.ua/api/categories/', {
            method: 'GET',
            headers: {
                'Accept-Language': language
            }
        });

        if (!response.ok) {
            console.error('Помилка при отриманні категорій:', response.statusText);
            return;
        }

        const data = await response.json();
        const category = data.results.find(item => item.slug === slug); // Знаходимо категорію за slug

        if (category) {
            document.querySelector('h2').innerText = category.name;
            document.querySelector('.title').innerText = category.name;
        } else {
            console.error('Категорію не знайдено');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
fetchCategories(lang);