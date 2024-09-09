$.ajax({
  type: 'GET',
  url: 'http://127.0.0.1:8000/articles/',
  dataType: 'json',
  success: function(data) {
    console.log(data);
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
      
        $('#cards-container').append(cardHTML);
        if (i === 0) {
          $('#cards-container > :eq(0)').attr('id', 'square');
        }
      }
    },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});