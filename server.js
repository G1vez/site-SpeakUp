import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware для обслуговування статичних файлів з папки src/pages
app.use('/pages', express.static(path.join(__dirname, '/src/pages/')));

// Middleware для обробки JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// Глобальна змінна для зберігання категорій
let categories = [];

// Функція для отримання категорій
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

// Виклик функції для отримання категорій
fetchCategories();

// Маршрут для категорій
app.get('/categories/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;

    // Знаходимо категорію за слагом
    const category = categories.find(category => category.slug === categoryName);

    if (category) {
        res.sendFile(path.join(__dirname, 'public', 'specific-category.html'));
    } else {
        res.status(404).send('Категорія не знайдена'); // Обробка для невідомих категорій
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});