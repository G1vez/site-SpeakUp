import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import fs from 'fs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/pages', express.static(path.join(__dirname, '/src/pages/')));
app.use(express.json());

// Шлях до заголовка
const headerPath = path.join(__dirname, 'src/pages/header.html');

// Функція для читання заголовка
const getHeader = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(headerPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const footerPath = path.join(__dirname, 'src/pages/footer.html');

const getFooter = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(footerPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const injectHeaderAndFooter = async (filePath) => {
    const header = await getHeader();
    const footer = await getFooter();
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                reject(err);
            } else {
                const modifiedContent = content.replace('<main>', `${header}<main>`).replace('</body>', `${footer}</body>`);
                resolve(modifiedContent);
            }
        });
    });
};

app.get('/', async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/index.html'));
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send('Помилка при читанні головної сторінки');
    }
});

app.get('/home', async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/index.html'));
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send('Помилка при читанні головної сторінки');
    }
});

app.get('/about', async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/about.html'));
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send('Помилка при читанні сторінки про нас');
    }
});

app.get('/stories', async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/stories.html'));
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send('Помилка при читанні сторінки для історій');
    }
});

app.get('/useful-links', async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/useful-links.html'));
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send('Помилка при читанні сторінки для корисних посилань');
    }
});

app.get('/articles', async (req, res) => {
    try {
        const htmlContent = await injectHeaderAndFooter(path.join(__dirname, '/public/articles.html'));
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send('Помилка при читанні сторінки для корисних посилань');
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

app.get('/categories/:categoryName', async (req, res) => {
    const categoryName = req.params.categoryName;
    const category = categories.find(category => category.slug === categoryName);

    if (category) {
        try {
            const htmlContent = await injectHeaderAndFooter(path.join(__dirname, 'public', 'specific-category.html'));
            res.send(htmlContent);
        } catch (err) {
            res.status(500).send('Помилка при читанні сторінки категорії');
        }
    } else {
        res.status(404).send('Категорія не знайдена');
    }
});

app.get('/articles/:slug', async (req, res) => {
    const slug = req.params.slug;
    let articles = [];
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

    const article = articles.find(article => article.detail_url.split('/').slice(-2, -1)[0] === slug);

    if (article) {
        try {
            const htmlContent = await injectHeaderAndFooter(path.join(__dirname, 'public', 'article.html'));
            res.send(htmlContent);
        } catch (err) {
            res.status(500).send('Помилка при читанні статті');
        }
    } else {
        res.status(404).send('Стаття не знайдена');
    }
});


app.get('/tags/:slug', async (req, res) => {
    const slug = req.params.slug;
    let Tags = [];
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
        res.status(500).send('Помилка при читанні статті');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});