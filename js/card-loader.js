// const loadingPlaceholderHTML = `
// <div class="card loading-placeholder">
//     <div class="card-image-placeholder"></div>
//     <h2 class="card-title-placeholder"></h2>
//     <p class="card-description-placeholder"></p>
// </div>
// `;

// const cardContainer = $('#cards-container');
// for (let i = 0; i < 10; i++) {
// cardContainer.append(loadingPlaceholderHTML);
// }

$.ajax({
type: 'GET',
url: 'http://127.0.0.1:8000/articles/',
dataType: 'json',
success: function(data) {
    console.log(data);
    $.each(data, function(index, item) {
    const cardHTML = `
    <figure>
      <a href=" ">
        <img src="${item.image_url}" alt="${item.title}">
      </a>
    </figure>
    <div>
      <a href=" " class="article-text black">${item.title}</a>
      <div class="gray text-card">${item.intro}</div>
    </div>
    `;

    $(`.loading-placeholder:eq(${index})`).replaceWith(cardHTML);
    });
},
error: function(xhr, status, error) {
    console.error('Error:', error);
}
});