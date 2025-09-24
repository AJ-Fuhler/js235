import debounce from './debounce.js';

class ContactManager {
  constructor() {
    this.rowContainer = document.querySelector('.row-container');
    this.input = document.querySelector('input');
    this.contactList = document.querySelector('.contacts');
    this.emptyContactsPlaceholder = document.querySelector('.empty-contacts-placeholder');
    this.emptySearchPlaceholder = document.querySelector('.empty-search-contacts-placeholder');
    this.contactButtons = document.querySelectorAll('.btn.contact-btn');
    this.tagButton = document.querySelector('.btn.tag-btn');
    this.searchQuery = document.getElementById('search-query');
    this.contacts = [];

    this.valueChanged = debounce(this.valueChanged.bind(this), 300);

    this.bindEvents();

    this.reset();
  }

  bindEvents() {
    this.input.addEventListener('input', this.valueChanged);
    this.contactButtons.forEach(btn => btn.addEventListener('click', this.handleAddContactButton.bind(this)));
    // this.tagButton.addEventListener('click', this.handleTagButton.bind(this));
  }

  async reset() {
    this.emptyContactsPlaceholder.classList.add('hide');
    this.emptySearchPlaceholder.classList.add('hide');

    while (this.contactList.lastChild) {
      this.contactList.lastChild.remove();
    }

    let response = await fetch('/api/contacts');
    this.contacts = await response.json();

    if (this.contacts.length === 0) {
      this.emptyContactsPlaceholder.classList.remove('hide');
    }

    this.renderContacts()
  }

  renderContacts() {
    this.contacts.forEach(contact => {
      let html = `<li><h3 class="contact-name">${contact.full_name}</h3>
<dl>
  <dt>Phone Number:</dt>
  <dd>${contact.phone_number}</dd>
  <dt>Email:</dt>
  <dd>${contact.email}</dd>
  <dt>Tags:</dt>
  <dd>${contact.tags || 'none'}</dt>
</dl>
<div class="contact-btn-wrapper">
  <a href="/contacts/${contact.id}" class="edit">Edit</a>
  <a href="/contacts/${contact.id}" class="delete">Delete</a>
</div></li>`

    this.contactList.insertAdjacentHTML('beforeend', html);
    });
  }

  async valueChanged() {
    let value = this.input.value;
  }

  handleAddContactButton(event) {
    event.preventDefault();
    console.log('inaddButtonHandler');
    this.rowContainer.classList.add('hide');
    this.contactList.classList.add('hide');
  }
}

new ContactManager();