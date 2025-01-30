const tooltip = document.querySelector('.tooltip');
const closeBtn = document.querySelector('.close-btn');

// Показуємо спливаюче вікно через 1 секунду
setTimeout(() => {
  tooltip.classList.add('show');
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
  closeBtn.addEventListener('click', () => {
    // Анімація закриття
    tooltip.style.opacity = 0;
    tooltip.style.transform = 'scale(0)';
    
    // Сховати спливаюче вікно через 300 мс (час анімації)
    setTimeout(() => {
      tooltip.style.display = 'none';
    }, 300);
  });
});

// Додатково: закриття спливаючого вікна при натисканні поза ним
document.addEventListener('click', (event) => {
  if (!tooltip.contains(event.target) && !closeBtn.contains(event.target)) {
    tooltip.style.opacity = 0;
    tooltip.style.transform = 'scale(0)';
    setTimeout(() => {
      tooltip.style.display = 'none';
    }, 300);
  }
});