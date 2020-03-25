'use strict';
// console.log('hola mundo');

let series = [];
let favourites = [];
let searchInput = document.querySelector('.js-search');
let searchButton = document.querySelector('.js-search-btn');
let seriesResult = document.querySelector('.js-series');
let addToFavourites = document.querySelector('.js-selected-series');

getFromLocalStorage();
getSearchFromLocalStorage();

// Petición para obtener la información del API

function getApiData(ev) {
  ev.preventDefault();
  let text = searchInput.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${text}`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      series = data;
      paintSeries();
      saveSearchToLocalStorage();
    });
}

// Función para crear el código de las series obtenidas de la busqueda anterior, obteniendo la imagen, el título y el id

function paintSeries() {
  let htmlCode = '';

  for (const serie of series) {
    htmlCode += `<article class="js-add-serie js-selected-favourite serie-item" data-id="${serie.show.id}" >`;
    if (serie.show.image != null) {
      htmlCode += `<img src="${serie.show.image.medium}" data-id="${serie.show.id}" />`;
    } else {
      htmlCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?" data-id="${serie.show.id}"/>`;
    }
    htmlCode += `<div class ="title-serie"><h2 class="title-inner" data-id="${serie.show.id}">${serie.show.name} </h2></div>`;
    htmlCode += `<div><h3 >${serie.show.schedule.days}</h3></div>`;
    htmlCode += `</article>`;
    // console.log(serie.show.name);
  }
  seriesResult.innerHTML = htmlCode;

  listenAddSeries();
  setFavouriteStyle();
}

searchButton.addEventListener('click', getApiData);

//Función escuchadora sobre cada una de las series resultado de la búsqueda

function listenAddSeries() {
  const seriesItems = document.querySelectorAll('.js-add-serie');
  for (const seriesItem of seriesItems) {
    // console.log(seriesItem);
    seriesItem.addEventListener('click', addSerie);
  }
}
// Función que añade la serie seleccionada de los resultados de búsqueda a favoritos

function addSerie(ev) {
  // busco si la serie ya está en favoritos para no añadrila dos veces
  const clickedId = parseInt(ev.target.dataset.id);
  let foundId;
  for (const favourite of favourites) {
    if (favourite.show.id === clickedId) {
      foundId = favourite;
    }
  }
  // si no está en favoritos, busco la serie clickada en el array de series inicial resultado de la búsqueda
  if (foundId === undefined) {
    for (const serie of series) {
      if (serie.show.id === clickedId) {
        favourites.push(serie);
      }
    }
  }
  paintFavourites();
  setFavouriteStyle();
}
//Función para eliminar uno de los favoritos de la columna de series favoritas

function removeFavourite(ev) {
  const clickedId = parseInt(ev.target.dataset.id);

  for (let index = 0; index < favourites.length; index += 1) {
    if (favourites[index].show.id === clickedId) {
      // favourites.splice(index, 1);
      console.log(favourites[index].show.name);

      //llamo a la función que elimina el estilo de serie seleccionada para que se elimine a la vez que se suprime el favorito de la columna
      removeFavouriteStyle(clickedId);
    }
  }

  paintFavourites();
}
// Función escuchadora que escucha el evento sobre la cruz que clickamos para eliminar el favorito de la columna de favoritos

function listenRemoveFavorite() {
  const favouritesItems = document.querySelectorAll('.js-delete-cross');

  for (const favouritesItem of favouritesItems) {
    // console.log(favouritesItem);
    favouritesItem.addEventListener('click', removeFavourite);
  }
}
//Función que pinta las series favoritas

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

  // Llamo a las funciones que eliminan la serie de favoritos deseleccionada y la función que las guarda en el local storage para que se ejecuten cuando se pintan
  listenRemoveFavorite();
  saveToLocalStorage();
}

//Función para eliminar la lista entera de favoritos

function clearFavourites() {
  favourites.splice(favourites[0], favourites.length);

  paintFavourites();
  paintSeries();
}

const resetButton = document.querySelector('.js-clear');
resetButton.addEventListener('click', clearFavourites);

//Guardando la lista de favoritos en el Local storage

function saveToLocalStorage() {
  localStorage.setItem('myFavourites', JSON.stringify(favourites));
}
function getFromLocalStorage() {
  if (JSON.parse(localStorage.getItem('myFavourites')) != null) {
    favourites = JSON.parse(localStorage.getItem('myFavourites'));
  }
  paintFavourites();
}

//Guardar la Busqueda de series buscadas cuando refresco página

function saveSearchToLocalStorage() {
  localStorage.setItem('mySearch', JSON.stringify(series));
}
function getSearchFromLocalStorage() {
  if (JSON.parse(localStorage.getItem('mySearch')) != null) {
    series = JSON.parse(localStorage.getItem('mySearch'));
  }
  paintSeries();
}

//Función que añade el estilo de serie seleccionada como favoritos en el array de resultados de búsqueda

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
//Función que elimina el estilo de la serie deseleccionada de favoritos en el array de resultados de búsqueda
// Le paso como parámetro el id de la serie que voy a quitar en favoritos
function removeFavouriteStyle(serieId) {
  let serieArticles = seriesResult.querySelectorAll('article');

  for (let i = 0; i < series.length; i++) {
    if (serieId === series[i].show.id) {
      serieArticles[i].classList.remove('selected-favourite');
    }
  }
}
