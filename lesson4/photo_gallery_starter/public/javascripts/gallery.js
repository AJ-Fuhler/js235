import templates from './templates.js';

let photos;

class SlideShow {
  constructor(activePhotoId) {
    this.previous = document.querySelector('.prev');
    this.next = document.querySelector('.next');
    this.currentPhotoIndex = photos.indexOf(photos.find(item => item.id === activePhotoId));
    this.currentPhotoId = activePhotoId;
    this.slides = document.querySelectorAll('#slides figure');

    this.bindEvents();
    this.hideAllSlidesShowCurrent();

  }

  bindEvents() {
    this.previous.addEventListener('click', this.handlePreviousClick.bind(this));
    this.next.addEventListener('click', this.handleNextClick.bind(this));
  }

  async handlePreviousClick() {
    if (this.currentPhotoIndex === 0) {
      this.currentPhotoIndex = photos.length - 1;
    } else {
      this.currentPhotoIndex -= 1;
    }

    this.currentPhotoId = photos[this.currentPhotoIndex].id;
    this.hideAllSlidesShowCurrent();
    let comments = await fetchCommentsFor(this.currentPhotoId);
    this.updateSlideContent(this.currentPhotoId, comments);
  }

  async handleNextClick() {
    if (this.currentPhotoIndex === photos.length - 1) {
      this.currentPhotoIndex = 0;
    } else {
      this.currentPhotoIndex += 1;
    }

    this.currentPhotoId = photos[this.currentPhotoIndex].id;
    this.hideAllSlidesShowCurrent();
    let comments = await fetchCommentsFor(this.currentPhotoId);
    this.updateSlideContent(this.currentPhotoId, comments);
  }

  updateSlideContent(photoId, comments) {
    renderPhotoInformation(photoId);
    renderComments(comments);
  }

  hideAllSlidesShowCurrent() {
    this.slides.forEach(slide => {
      slide.classList.remove('show', 'hide');
      if (slide.dataset.id == this.currentPhotoId) {
        slide.classList.add('show');
      } else {
        slide.classList.add('hide');
      }
    });
  }

}

async function handleLikesAndFavoritesClick(event) {
  event.preventDefault();

  let target = event.target;
  let id = target.dataset.id;
  if (!id) return;

  let url = target.getAttribute('href');
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({photo_id: id}),
  });

  let json = await response.json();
  let newTotal = json.total;

  target.textContent = target.textContent.replace(/\d+/g, newTotal);
}

async function fetchPhotos() {
  let response = await fetch('/photos');
  return response.json();
}

async function fetchCommentsFor(photoId) {
  let response = await fetch(`/comments?photo_id=${photoId}`);
  return response.json();
}

function renderPhotos() {
  let slides = document.getElementById('slides');
  slides.innerHTML = templates.photos(photos);
}

function renderPhotoInformation(photoId) {
  let photo = photos.find(item => item.id === photoId);
  let header = document.getElementById('information');
  header.innerHTML = templates.photoInformation(photo);
}

function renderComments(comments) {
  let commentList = document.querySelector('#comments ul');
  commentList.innerHTML = templates.comments(comments);
}

async function submitComment(event) {
  event.preventDefault();

  let photoId = document.querySelector('#slides figure.show').dataset.id;
  let formData = new FormData(event.target);
  formData.set('photo_id', photoId);
  let queryString = new URLSearchParams(formData);
  let url = event.target.getAttribute('action');
  let response = await fetch(url, {
    method: 'POST',
    body: queryString,
  });

  let json = await response.json();
  let comments = await fetchCommentsFor(json.photo_id);
  renderComments(comments);
  event.target.reset();
}

async function main() {
  photos = await fetchPhotos();
  let activePhotoId = photos[0].id;
  renderPhotos();
  renderPhotoInformation(activePhotoId);

  let comments = await fetchCommentsFor(activePhotoId);
  renderComments(comments);

  new SlideShow(activePhotoId);
  document.getElementById('information').addEventListener('click', handleLikesAndFavoritesClick);
  document.querySelector('form').addEventListener('submit', submitComment);
}

document.addEventListener('DOMContentLoaded', main);