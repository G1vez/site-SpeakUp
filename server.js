import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/pages', express.static(path.join(__dirname, '/src/pages/')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
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
app.get('/categories/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;
    const category = categories.find(category => category.slug === categoryName);

    if (category) {
        res.sendFile(path.join(__dirname, 'public', 'specific-category.html'));
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
        res.sendFile(path.join(__dirname, 'public', 'article.html'));
    } else {
        res.status(404).send('Стаття не знайдена');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});