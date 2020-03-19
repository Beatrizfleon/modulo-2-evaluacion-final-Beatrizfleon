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
function paintSeries() {
  let htmlCode = '';
  htmlCode += `<ul>`;
  for (const serie of series) {
    htmlCode += `<li>${serie.show.name}</li>`;
    console.log(serie.show.name);
  }
  htmlCode += `</ul>`;
  seriesResult.innerHTML = htmlCode;
}
searchButton.addEventListener('click', getApiData);
