'use strict';
// console.log('hola mundo');

let series = [];
let favourites = [];
let searchInput = document.querySelector('.js-search');
let searchButton = document.querySelector('.js-search-btn');
let seriesResult = document.querySelector('.js-series');
let addToFavourites = document.querySelector('.js-selected-series');

getFromLocalStorage();

// Query getting information from the API

function getApiData(ev) {
  ev.preventDefault();
  let text = searchInput.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${text}`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      series = data;
      paintSeries();
    });
}

function paintSeries() {
  let htmlCode = '';

  for (const serie of series) {
    htmlCode += `<article class="js-add-serie js-selected-favourite serie-item" data-id="${serie.show.id}" >`;
    if (serie.show.image != null) {
      htmlCode += `<img src="${serie.show.image.medium}" data-id="${serie.show.id}" />`;
    } else {
      htmlCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?" data-id="${serie.show.id}"/>`;
    }
    htmlCode += `<div class ="title-serie"><h2 class="title" data-id="${serie.show.id}">${serie.show.name}</h2></div>`;
    htmlCode += `</article>`;
    // console.log(serie.show.name);
  }
  seriesResult.innerHTML = htmlCode;

  listenAddSeries();
  setFavouriteStyle();
}
searchButton.addEventListener('click', getApiData);

//Listen series

function listenAddSeries() {
  const seriesItems = document.querySelectorAll('.js-add-serie');
  for (const seriesItem of seriesItems) {
    // console.log(seriesItem);
    seriesItem.addEventListener('click', addSerie);
  }
}

function addSerie(ev) {
  const clickedId = parseInt(ev.target.dataset.id);
  let foundId;
  for (const favourite of favourites) {
    if (favourite.show.id === clickedId) {
      foundId = favourite;
    }
  }
  if (foundId === undefined) {
    // busco la serie clickada en el array de series inicial

    for (const serie of series) {
      if (serie.show.id === clickedId) {
        favourites.push(serie);
      }
    }
  }
  paintFavourites();
  setFavouriteStyle();
}

function removeFavourite(ev) {
  const clickedId = parseInt(ev.target.dataset.id);

  for (let index = 0; index < favourites.length; index += 1) {
    if (favourites[index].show.id === clickedId) {
      favourites.splice(index, 1);
      removeFavouriteStyle(clickedId);
    }
  }

  paintFavourites();
}

function listenRemoveFavorite() {
  const favouritesItems = document.querySelectorAll('.js-delete-cross');
  for (const favouritesItem of favouritesItems) {
    // console.log(favouritesItem);
    favouritesItem.addEventListener('click', removeFavourite);
  }
}

function paintFavourites() {
  let htmlCodeFavourites = '';
  for (const favourite of favourites) {
    htmlCodeFavourites += `<article class="selected-item">`;
    if (favourite.show.image != null) {
      htmlCodeFavourites += `<img src="${favourite.show.image.medium}"  class="img-favourite" />`;
    } else {
      htmlCodeFavourites += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?" class="img-favourite"/>`;
    }
    htmlCodeFavourites += `<div class="title-icon">`;
    htmlCodeFavourites += `<h2 class="favourite-title">${favourite.show.name}</h2>`;
    htmlCodeFavourites += `<span><i class="fas fa-times-circle js-delete-cross" data-id="${favourite.show.id}"></i></span>`;
    htmlCodeFavourites += `</div>`;
    htmlCodeFavourites += `</article>`;
  }
  addToFavourites.innerHTML = htmlCodeFavourites;
  listenRemoveFavorite();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('myFavourites', JSON.stringify(favourites));
}
function getFromLocalStorage() {
  if (JSON.parse(localStorage.getItem('myFavourites')) != null) {
    favourites = JSON.parse(localStorage.getItem('myFavourites'));
  }
  paintFavourites();
}

function setFavouriteStyle() {
  let serieArticles = seriesResult.querySelectorAll('article');

  for (let favourite of favourites) {
    for (let i = 0; i < series.length; i++) {
      if (favourite.show.id === series[i].show.id) {
        serieArticles[i].classList.add('selected-favourite');
      }
    }
  }
}
// Le paso como parámetro el id de la serie que voy a quitar en favoritos
function removeFavouriteStyle(serieId) {
  let serieArticles = seriesResult.querySelectorAll('article');

  for (let i = 0; i < series.length; i++) {
    if (serieId === series[i].show.id) {
      serieArticles[i].classList.remove('selected-favourite');
    }
  }
}
