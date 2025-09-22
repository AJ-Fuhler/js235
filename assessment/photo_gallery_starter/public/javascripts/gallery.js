import templates from './templates.js';

let slidesDiv = document.getElementById('slides');
let photoInformation = document.getElementById('information');
let commentsUL = document.getElementById('comments').querySelector('ul');
let buttonsUL = document.getElementById('slideshow').querySelector('ul');
let form = document.querySelector('form');
let likeButton;
let favoriteButton;
let photos;
let currentPhotoIndex = 0;


async function fetchPhotos() {
  let response = await fetch('/photos');
  return response.json();
}

async function renderPhotos() {
  let html = templates.photos(photos);
  slidesDiv.insertAdjacentHTML('beforeend', html);
}

function displayPhotoInformation(photo) {
  let html = templates.photoInformation(photo);
  photoInformation.innerHTML = html;
}

async function getCommentsOf(photo) {
  let response = await fetch(`/comments?photo_id=${photo.id}`);
  return response.json();
}

function displayComments(comments) {
  let html = templates.comments(comments);
  commentsUL.innerHTML = html;
}

async function setInitialState() {
  photos = await fetchPhotos();
  await renderPhotos();
  displayPhotoInformation(photos[0]);
  let comments = await getCommentsOf(photos[0]);
  displayComments(comments);
  likeButton = photoInformation.querySelector('.button.like');
  favoriteButton = photoInformation.querySelector('.button.favorite');
}

function getPreviousPhoto() {
  currentPhotoIndex = currentPhotoIndex === 0 ? photos.length - 1 : currentPhotoIndex - 1;
  return photos[currentPhotoIndex];
}

function getNextPhoto() {
  currentPhotoIndex = currentPhotoIndex === photos.length - 1 ? 0 : currentPhotoIndex + 1;
  return photos[currentPhotoIndex];
}

function hideAllBut(photo) {
  slidesDiv.querySelectorAll('figure').forEach(figure => {
    if (figure.dataset.id === String(photo.id)) {
      figure.className = 'show';
    } else {
      figure.className = 'hide';
    }
  })
}

async function handleNextOrPrevious(event) {
  if (event.target.tagName === 'A') {
    event.preventDefault();

    if (event.target.classList.contains('prev')) {
      hideAllBut(getPreviousPhoto(currentPhotoIndex));
    } else if (event.target.classList.contains('next')) {
      hideAllBut(getNextPhoto(currentPhotoIndex));
    }

    displayPhotoInformation(photos[currentPhotoIndex]);
    let comments = await getCommentsOf(photos[currentPhotoIndex]);
    displayComments(comments);
  }
}

async function handleLikeOrFavorite(event) {
  event.preventDefault();
  let id = event.target.dataset.id;
  let data = {photo_id: id};
  let property = event.target.dataset.property;
  let url = property === 'likes' ? '/photos/like' : '/photos/favorite';

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  let body = await response.json();
  let total = body.total;

  event.target.textContent = event.target.textContent.replace(/\d+/g, total);
}

async function handleFormSubmission(event) {
  event.preventDefault();

  let url = form.getAttribute('action');
  let data = new FormData(form);
  data.set('photo_id', photos[currentPhotoIndex].id);

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: new URLSearchParams([...data]),
  });

  let comments = await getCommentsOf(photos[currentPhotoIndex]);
  displayComments(comments);

  form.reset();
}

async function main() {
  await setInitialState();

  buttonsUL.addEventListener('click', handleNextOrPrevious);
  photoInformation.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      handleLikeOrFavorite(event);
    }
  });

  form.addEventListener('submit', handleFormSubmission);
}

document.addEventListener('DOMContentLoaded', main);