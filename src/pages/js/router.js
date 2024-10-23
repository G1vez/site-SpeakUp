class Router {
    constructor() {
      this.routes = {};
    }
  
    addRoute(path, callback) {
      this.routes[path] = callback;
    }
  
    navigate(path) {
      if (this.routes[path]) {
        this.routes[path]();
      } else {
        console.error(`Роут не знайдений: ${path}`);
      }
    }
  
    listen() {
      window.addEventListener('popstate', () => {
        this.navigate(window.location.pathname);
      });
    }
}

const router = new Router();

router.addRoute('/categories/:slug', (params) => {
const slug = params.slug;
// Отримуємо дані з API або локального джерела даних
fetchCategories()
    .then(data => {
    const category = data.results.find(item => item.slug === slug);
    if (category) {
        // Оновлюємо вміст сторінки відповідно до даних категорії
        document.getElementById('title').textContent = category.name;
        document.getElementById('title2').textContent = category.name;
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer.innerHTML = '';
        // Додаємо вміст категорії у контейнер
        category.items.forEach(item => {
        const cardHTML = `
            <div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            </div>
        `;
        cardsContainer.innerHTML += cardHTML;
        });
    } else {
        console.error(`Категорія не знайдена: ${slug}`);
    }
    })
    .catch(error => {
    // Обробка помилки
    });
});
router.listen();
router.navigate(`/categories/${slug}`);
