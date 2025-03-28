// Функція для оновлення стилів перемикача мови
function updateLanguageSwitcher() {
    const currentLang = localStorage.getItem('language') || 'uk-UA'; // Визначаємо мову з localStorage або за замовчуванням 'uk'
    document.documentElement.lang = currentLang; // Оновлюємо атрибут lang у тегу <html>    
    document.querySelectorAll('.lang-switcher').forEach(link => {
        if (link.getAttribute('data-lang') === currentLang) {
            link.classList.remove('gray'); // Видаляємо неактивний стиль
            link.classList.add('black', 'fw-500'); // Додаємо активні стилі
        } else {
            link.classList.remove('black', 'fw-500'); // Видаляємо активні стилі
            link.classList.add('gray'); // Додаємо неактивний стиль
        }
    });
}

function getShortLang(lang) {
    return lang.split('-')[0]; // Отримуємо короткий код мови
}

// Функція для завантаження мови
async function loadLanguage(lang) {
    try {
        const response = await fetch(`/locales/${getShortLang(lang)}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dictionary = await response.json();
        updateContent(dictionary);
    } catch (error) {
        console.error('Error loading language:', error);
    }
}

// Функція для оновлення контенту на сторінці
function updateContent(dictionary) {
    document.querySelectorAll('.content').forEach(element => {
        const key = element.getAttribute('data-key');
        // Додаємо перевірку наявності атрибута data-key
        if (key && dictionary[key]) {
            element.innerHTML = dictionary[key]; // Використовуємо innerHTML для збереження HTML-тегів
        }
    });
}

function updateSectionLinks(lang) {
    const sectionLinks = document.querySelectorAll('section a'); // Знаходимо всі посилання в секції
    sectionLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) { // Переконуємося, що це не зовнішнє посилання
            // Додаємо короткий код мови до URL, якщо його немає
            if (!href.startsWith('/uk/') && !href.startsWith('/en/')) {
                link.setAttribute('href', `/${getShortLang(lang)}${href}`);
            }
        }
    });
}

// Оновлюємо ініціал ізацію мови
function initializeLanguage() {
    // Перевіряємо, чи є URL кореневим
    if (window.location.pathname === '/') {
        localStorage.setItem('language', 'uk-UA'); // Зберігаємо українську мову в localStorage
        window.location.href = '/uk/'; // Перенаправляємо на /uk/
        return; // Виходимо з функції, щоб не виконувати подальший код
    }

    // Визначаємо мову з URL або з localStorage
    const pathLang = window.location.pathname.startsWith('/uk/') ? 'uk-UA' : 'en-US';
    let currentLang = localStorage.getItem('language') || 'uk-UA'; // За замовчуванням 'uk'

    // Оновлюємо localStorage, якщо мова визначена з URL
    if (currentLang !== pathLang) {
        localStorage.setItem('language', pathLang);
        currentLang = pathLang; // Оновлюємо currentLang
    }

    document.documentElement.lang = currentLang; // Встановлюємо lang при завантаженні
    transferLanguageToCookies(); // Передаємо мову в кукі
    loadLanguage(currentLang); // Завантажуємо мову при завантаженні сторінки
    updateLanguageSwitcher(); // Оновлюємо стилі перемикача мови

    // Оновлюємо посилання в навігації
    updateNavLinks(currentLang);
    updateFooterLinks(currentLang);
    updateSectionLinks(currentLang); // Оновлюємо посилання в секції
}

// Функція для оновлення посилань у навігації
function updateNavLinks(lang) {
    const links = document.querySelectorAll('nav a'); // Знаходимо всі посилання в навігації
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) { // Переконуємося, що це не зовнішнє посилання
            // Додаємо короткий код мови до URL, якщо його немає
            if (!href.startsWith('/uk/') && !href.startsWith('/en/')) {
                link.setAttribute('href', `/${getShortLang(lang)}${href}`);
            }
        }
    });
}

// Функція для оновлення посилань у футері
function updateFooterLinks(lang) {
    const footerLinks = document.querySelectorAll('.nav-footer a'); // Знаходимо всі посилання у футері
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) { // Переконуємося, що це не зовнішнє посилання
            // Додаємо короткий код мови до URL, якщо його немає
            if (!href.startsWith('/uk/') && !href.startsWith('/en/')) {
                link.setAttribute('href', `/${getShortLang(lang)}${href}`);
            }
        }
    });
}

// Функція для передачі мови з localStorage в кукі
function transferLanguageToCookies() {
    const language = localStorage.getItem('language'); // Отримуємо мову з localStorage
    if (language) {
        // Надсилаємо запит на сервер для встановлення кукі
        fetch('/set-language', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language: language }), // Передаємо мову на сервер
        }).catch(error => console.error('Error transferring language to cookies:', error));
    }
}

// Переключення мови
document.querySelectorAll('.lang-switcher').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Запобігаємо переходу за посиланням

        // Отримуємо мову з атрибута data-lang
        const lang = this.getAttribute('data-lang');
        const currentLang = localStorage.getItem('language') || 'uk-UA'; // Отримуємо поточну мову

        // Якщо мова вже обрана, нічого не робимо
        if (lang === currentLang) {
            return; // Виходимо з функції
        }

        // Зберігаємо вибір мови в localStorage
        localStorage.setItem('language', lang);
        transferLanguageToCookies(); // Передаємо нову мову в кукі

        // Формуємо нову URL
        const currentPath = window.location.pathname; // Оголошуємо currentPath тут
        const currentParams = new URLSearchParams(window.location.search); // Отримуємо поточні параметри URL
        let newPath;

        // Додаємо параметри до нової URL
        if (currentPath.startsWith('/uk/')) {
            newPath = currentPath.replace('/uk/', `/${getShortLang(lang)}/`);
        } else if (currentPath.startsWith('/en/')) {
            newPath = currentPath.replace('/en/', `/${getShortLang(lang)}/`);
        } else {
            newPath = `/${getShortLang(lang)}${currentPath}`;
        }

        // Додаємо параметри до нової URL, якщо вони не пусті
        if (currentParams.toString()) {
            newPath += `?${currentParams.toString()}`; // Додаємо параметри до нової URL
        }

        // Перенаправляємо на нову URL
        window.location.assign(newPath); // Оновлюємо сторінку з новою мовою
    });
});

// Автоматично передаємо мову в кукі при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    transferLanguageToCookies();
});

// Ініціалізуємо мову при завантаженні сторінки
initializeLanguage();