import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises'; // Використовуємо promises API для fs
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Статичні файли
app.use(cookieParser());
app.use(bodyParser.json()); // Для обробки JSON-т bodies
app.use('/pages', express.static(path.join(__dirname, '/src/pages/')));
app.use('/locales', express.static(path.join(__dirname, 'locales')));
app.use(express.json()); // Виклик одного разу

// Шляхи до заголовка та підвалу
const headerPath = path.join(__dirname, 'src/pages/header.html');
const footerPath = path.join(__dirname, 'src/pages/footer.html');

// Функція для читання заголовка
const getHeader = async () => {
    try {
        return await fs.readFile(headerPath, 'utf-8');
    } catch (err) {
        console.error('Error reading header:', err);
        throw err;
    }
};

// Функція для читання підвалу
const getFooter = async () => {
    try {
        return await fs.readFile(footerPath, 'utf-8');
    } catch (err) {
        console.error('Error reading footer:', err);
        throw err;
    }
};

// Функція для інжекції заголовка та підвалу
const injectHeaderAndFooter = async (filePath) => {
    const header = await getHeader();
    const footer = await getFooter();
    const content = await fs.readFile(filePath, 'utf-8');
    return content.replace('<main>', `${header}<main>`).replace('</body>', `${footer}</body>`);
};

// Функція для обробки запитів
const renderPage = async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/index.html'));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering page:', err);
        res.status(500).send('Помилка при читанні головної сторінки');
    }
};

const validLangs = ['uk', 'en'];

// Обробка маршрутів
app.get(['/', '/uk', '/en'], renderPage);

app.get('/:lang/home', async (req, res) => {
    const lang = req.params.lang;

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        // Встановлюємо заголовок Content-Language
        res.set('Content-Language', lang);
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, `/public/index.html`));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering language page:', err);
        res.status(500).send('Помилка при читанні сторінки');
    }
});

app.get('/:lang/about', async (req, res) => {
    const lang = req.params.lang;

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, `/public/about.html`));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering about page:', err);
        res.status(500).send('Помилка при читанні сторінки про нас');
    }
});

app.get('/:lang/stories', async (req, res) => {
    const lang = req.params.lang;

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, `/public/stories.html`));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering stories page:', err);
        res.status(500).send('Помилка при читанні сторінки для історій');
    }
});

app.get('/:lang/useful-links', async (req, res) => {
    const lang = req.params.lang;

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, `/public/useful-links.html`));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering useful links page:', err);
        res.status(500).send('Помилка при читанні сторінки для корисних посилань');
    }
});

app.get('/:lang/articles', async (req, res) => {
    const lang = req.params.lang;

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, `/public/articles.html`));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering articles page:', err);
        res.status(500).send('Помилка при читанні сторінки для статей');
    }
});

let categories = [];
async function fetchCategories() {
    try {
        const response = await fetch('https://speakup.in.ua/api/categories/');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        categories = data.results;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

fetchCategories();

app.get('/:lang/categories/:categoryName', async (req, res) => {
    const lang = req.params.lang; 
    const categoryName = req.params.categoryName; 
    const category = categories.find(category => category.slug === categoryName);

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    if (category) {
        try {
            const htmlContent = await injectHeaderAndFooter(path.join(__dirname, 'public', 'specific-category.html'));
            res.send(htmlContent);
        } catch (err) {
            console.error('Error rendering specific category page:', err);
            res.status(500).send('Помилка при читанні сторінки категорії');
        }
    } else {
        try {
            const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/404.html'));
            res.status(404).send(htmlContent);
        } catch (err) {
            console.error('Error rendering 404 page:', err);
            res.status(500).send('Помилка при читанні сторінки 404');
        }
    }
});

app.get('/:lang/articles/:slug', async (req, res) => {
    const lang = req.params.lang; 
    const slug = req.params.slug; 
    let articles = [];

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        const response = await fetch('https://speakup.in.ua/api/articles/');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        articles = data.results;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return res.status(500).send('Внутрішня помилка сервера');
    }

    const article = articles.find (article => article.detail_url.split('/').slice(-2, -1)[0] === slug);

    if (article) {
        try {
            const htmlContent = await injectHeaderAndFooter(path.join(__dirname, 'public', 'article.html'));
            res.send(htmlContent);
        } catch (err) {
            console.error('Error rendering article page:', err);
            res.status(500).send('Помилка при читанні статті');
        }
    } else {
        try {
            const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/404.html'));
            res.status(404).send(htmlContent);
        } catch (err) {
            console.error('Error rendering 404 page:', err);
            res.status(500).send('Помилка при читанні сторінки 404');
        }
    }
});

app.get('/:lang/tags/:slug', async (req, res) => {
    const lang = req.params.lang; 
    const slug = req.params.slug; 
    let Tags = [];

    if (!validLangs.includes(lang)) {
        return handle404(req, res); // Викликаємо обробник 404
    }

    try {
        const response = await fetch(`https://speakup.in.ua/api/articles/by-tag/${slug}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        Tags = data.results;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return res.status(500).send('Внутрішня помилка сервера');
    }

    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, 'public', 'tag.html'));
        res.send(htmlContent);
    } catch (err) {
        console.error('Error rendering tag page:', err);
        res.status(500).send('Помилка при читанні статті');
    }
});

app.post('/set-language', (req, res) => {
    const { language } = req.body; // Отримуємо мову з тіла запиту
    res.cookie('language', language, { 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: 'None', // Додаємо атрибут SameSite
        secure: true // Додаємо атрибут Secure, якщо ви використовуєте HTTPS
    }); 
    res.sendStatus(200); // Відправляємо статус 200
});

// Обробка помилки 404
const handle404 = async (req, res) => {
    try {
        // Отримуємо мову з кукі
        let currentLang = req.cookies.language || 'uk'; // Встановлюємо українську за замовчуванням

        // Додаємо префікс мови до URL, якщо його немає
        if (!req.path.startsWith('/uk/') && !req.path.startsWith('/en/')) {
            return res.redirect(`/${currentLang}${req.path}`); // Додаємо префікс мови до URL
        }

        // Якщо URL вже містить 'uk' або 'en', просто відправляємо 404 сторінку
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/404.html'));
        res.status(404).send(htmlContent);
    } catch (err) {
        console.error('Error rendering 404 page:', err);
        res.status(500).send('Помилка при читанні сторінки 404');
    }
};

// Додаємо middleware для обробки 404
app.use((req, res, next) => {
    handle404(req, res);
});

app.get('/locales/:lang', (req, res) => {
    const lang = req.params.lang;
    res.sendFile(path.join(__dirname, 'locales', `${lang}.json`));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});