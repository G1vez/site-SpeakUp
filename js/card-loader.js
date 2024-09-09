$.ajax({
  type: 'GET',
  url: 'http://127.0.0.1:8000/articles/',
  dataType: 'json',
  success: function(data) {
    console.log(data);
    const numLoadingPlaceholders = $('.loading-placeholder').length;
    const numDataItems = data.length;
    const numItemsToProcess = Math.min(numLoadingPlaceholders, numDataItems);

    for (let i = 0; i < numItemsToProcess; i++) {
        const item = data[i];
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
      
        const loadingPlaceholder = $(`#cards-container > .loading-placeholder:eq(${i})`);
        if (i === 0) {
          loadingPlaceholder.attr('id', 'square');
        }
        loadingPlaceholder.html(cardHTML);
    }

    // Remove any remaining loading placeholders
    for (let i = numItemsToProcess; i < numLoadingPlaceholders; i++) {
      $(`#cards-container > .loading-placeholder:eq(${i})`).remove();
    }
  },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});