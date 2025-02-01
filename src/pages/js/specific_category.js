// Витягуємо slug з URL браузера
const url = window.location.href;
const urlObj = new URL(url);
const path = urlObj.pathname;
const segments = path.split('/').filter(segment => segment); // Фільтруємо пусті сегменти
const slug = segments.pop(); // Отримуємо slug

const decodedSlug = decodeURIComponent(slug);
document.querySelector('h2').innerText = decodedSlug;
document.querySelector('.title').innerText = decodedSlug;

// Отримуємо поточну мову
const lang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо мову з localStorage

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

let articles = []; // Зберігатимемо статті в масиві
let currentPage = 1; // Номер поточної сторінки
const limit = 15; // Кількість статей на запит

async function fetchArticles(language, sort) {
    let apiUrl;

    if (sort === 'popular') {
        apiUrl = `https://speakup.in.ua/api/articles/by-category/${slug}/?page=${currentPage}&limit=${limit}`; // Для популярних статей
    } else if (sort === 'newest') {
        apiUrl = `https://speakup.in.ua/api/articles/by-category/${slug}/?ordering=-publish_at&page=${currentPage}&limit=${limit}`; // Для найновіших статей
    } else {
        apiUrl = `https://speakup.in.ua/api/articles/by-category/${slug}/?page=${currentPage}&limit=${limit}`; // За замовчуванням
    }

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
        articles = data.results; // Зберігаємо статті в глобальному масиві
        displayArticles(articles); // Відображаємо статті
        updateLoadMoreButton(data.count); // Оновлюємо видимість кнопки "Завантажити ще"
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayArticles(articles) {
    const container = document.getElementById('cards-container'); // Змінити на ваш контейнер
    articles.forEach(item => {
        const cardHTML = createCardHTML(item);
        container.innerHTML += cardHTML; // Додаємо картки в контейнер
    });
}

function updateLoadMoreButton(totalArticles) {
    const loadMoreButton = document.getElementById('load-more-button');
    const totalLoadedArticles = currentPage * limit;

    // Якщо завантажено всіх статей, ховаємо кнопку
    if (totalLoadedArticles >= totalArticles) {
        loadMoreButton.style.display = 'none'; // Сховати кнопку
    } else {
        loadMoreButton.style.display = 'block'; // Показати кнопку
    }
}

// Додаємо обробник події для зміни вибору в спадному меню
document.getElementById('sort-options').addEventListener('change', function() {
    const selectedSort = this.value; // Отримуємо вибране значення
    currentPage = 1; // Скидаємо номер сторінки при зміні сортування
    document.getElementById('cards-container').innerHTML = ''; // Очищаємо контейнер
    fetchArticles(lang, selectedSort); // Викликаємо функцію для отримання статей з новим параметром сортування

    // Оновлюємо URL з параметром
    const url = new URL(window.location);
    url.searchParams.set('sort', selectedSort); // Додаємо або оновлюємо параметр 'sort'
    window.history.pushState({}, '', url); // Оновлюємо URL без перезавантаження сторінки
});

// Додаємо обробник події для кнопки "Завантажити ще"
document.getElementById('load-more-button').addEventListener('click', function() {
    currentPage++; // Збільшуємо номер сторінки
    fetchArticles(lang, document.getElementById('sort-options').value); // Отримуємо наступну порцію статей
});

// Читаємо параметр 'sort' з URL і викликаємо функцію для отримання статей
const sortParam = urlObj.searchParams.get('sort') || 'popular'; // За замовчуванням 'popular'
fetchArticles(lang, sortParam);

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