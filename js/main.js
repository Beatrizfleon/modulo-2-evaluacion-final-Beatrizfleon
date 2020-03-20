'use strict';
console.log('hola mundo');

let series = [];
let searchInput = document.querySelector('.js-search');
let searchButton = document.querySelector('.js-search-btn');
let seriesResult = document.querySelector('.js-series');

function getApiData(ev) {
  ev.preventDefault();
  let text = searchInput.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${text}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      series = data;
      paintSeries();
    });
}

// function getSeriesHtmlCode() {
//   let htmlCode = '';
//   htmlCode += `<article class="serie-item">`;
//   htmlCode += `<img src="http://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg" alt=" />`;
//   htmlCode += `<h2 class="title">Breaking Bad</h2>`;
//   htmlCode += `</article>`;
//   return htmlCode;
// }
function paintSeries() {
  let htmlCode = '';

  for (const serie of series) {
    htmlCode += `<article class="serie-item">`;
    if (serie.show.image != null) {
      htmlCode += `<img src="${serie.show.image.medium}" alt=" />`;
    } else {
      htmlCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?" alt=" />`;
    }
    htmlCode += `<h2 class="title">${serie.show.name}</h2>`;
    htmlCode += `</article>`;
    console.log(serie.show.name);
  }
  seriesResult.innerHTML = htmlCode;
}
searchButton.addEventListener('click', getApiData);

//Listen series
