import templates from './templates.js';

let photos;

class SlideShow {
  constructor(activePhotoId) {
    this.previous = document.querySelector('.prev');
    this.next = document.querySelector('.next');
    this.currentPhotoIndex = photos.indexOf(photos.find(item => item.id === activePhotoId));
    this.currentPhotoId = activePhotoId;

    this.bindEvents();

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
    let comments = await fetchCommentsFor(this.currentPhotoId);
    this.updateSlideContent(this.currentPhotoId, comments);
  }

  updateSlideContent(photoId, comments) {
    renderPhotoInformation(photoId);
    renderComments(comments);
  }

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

async function main() {
  photos = await fetchPhotos();
  let activePhotoId = photos[0].id;
  renderPhotos();
  renderPhotoInformation(activePhotoId);

  let comments = await fetchCommentsFor(activePhotoId);
  renderComments(comments);

  new SlideShow(activePhotoId);

}

document.addEventListener('DOMContentLoaded', main);