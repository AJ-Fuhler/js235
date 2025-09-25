import debounce from './debounce.js';

class ContactManager {
  constructor() {
    this.rowContainer = document.querySelector('.row-container');
    this.input = document.querySelector('input');
    this.contactList = document.querySelector('.contacts');
    this.emptyContactsPlaceholder = document.querySelector('.empty-contacts-placeholder');
    this.emptySearchPlaceholder = document.querySelector('.empty-search-contacts-placeholder');
    this.formPlaceholder = document.querySelector('.form-placeholder');
    this.contactButtons = document.querySelectorAll('.btn.contact-btn');
    this.addTagButton = document.querySelector('.btn.tag-btn');
    this.searchQuery = document.getElementById('search-query');
    this.tagsUL = document.querySelector('.tags');
    this.contacts = [];
    this.tags = [];

    this.valueChanged = debounce(this.valueChanged.bind(this), 300);

    this.reset();
    this.bindEvents();

  }

  bindEvents() {
    this.input.addEventListener('input', this.valueChanged);
    this.contactButtons.forEach(btn => btn.addEventListener('click', this.handleAddContactButton.bind(this)));
    this.addTagButton.addEventListener('click', this.handleAddTagButton.bind(this));
    document.addEventListener('reset', this.handleCancelButton.bind(this));
    document.addEventListener('submit', this.handleSubmit.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  handleAddTagButton(event) {
    event.preventDefault();

    this.rowContainer.classList.add('hide');
    this.contactList.classList.add('hide');
    this.emptyContactsPlaceholder.classList.add('hide');
    this.emptySearchPlaceholder.classList.add('hide');

    this.renderTagForm();
  }

  renderTagForm() {
    let html = `<form action="/tags" method="post">
  <h3>Add a Tag</h3>
  <label>
    Tag:
    <input type="text" name="tag" id="tag">
  </label>
  <button type="submit">Submit</button>
  <button type="reset">Cancel</button>
</form>`;

    this.formPlaceholder.innerHTML = html;
  }

  handleClick(event) {
    if (event.target.classList.contains('edit')) {
      this.handleEditContactButton(event);
    } else if (event.target.classList.contains('delete')) {
      this.handleDeleteContactButton(event);
    } else if (event.target.classList.contains('tag')) {
      this.handleTagSearchButton(event);
    }
  }

  handleTagSearchButton(event) {
    event.preventDefault();

    this.contactList.innerHTML = '';
    let tagName = event.target.textContent;

    if (tagName === 'All') {
      this.renderContacts(this.contacts);
      return;
    }

    let matches = this.contacts.filter(contact => {
      let contactTags = contact.tags.split(',');
      return contactTags.some(contactTag => contactTag.toLowerCase() === tagName.toLowerCase());
    });

    this.renderContacts(matches);
  }

  async handleDeleteContactButton(event) {
    event.preventDefault();

    const userConfirmed = confirm("Are you sure you want to delete this contact?");

    if (userConfirmed) {
      let id = event.target.getAttribute('href').match(/\d+/g)[0];
      let contact = this.contacts.find(contact => contact.id === id);
      let json = JSON.stringify(contact);

      await fetch(event.target.getAttribute('href'), {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
      });

      this.reset();
    }
  }

  handleCancelButton(event) {
    this.formPlaceholder.innerHTML = '';
    this.reset();
  }

  async handleSubmit(event) {
    event.preventDefault();
    let form = event.target;

    if (form.action.endsWith('/tags')) {
      let tag = new FormData(form).get('tag');
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
      this.reset();
      return;
    }



    let method = form.dataset.method? form.dataset.method : form.method;
    let formData = new FormData(form);
    let tags = formData.getAll('tags').join(',');
    formData.set('tags', tags);
    let json = JSON.stringify(Object.fromEntries(formData.entries()));

    await fetch(form.action, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    });

    this.reset();

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

    this.contactList.classList.remove('hide');
    this.rowContainer.classList.remove('hide');
    this.formPlaceholder.innerHTML = '';
    this.renderContacts(this.contacts);
    this.tags = this.getTags(this.tags);
    this.renderTags();
  }

  getTags(existingTags) {
    let allTags = this.contacts
      .flatMap(contact => {
        if (!contact.tags) return null;
        return contact.tags.split(',');
      })
      .concat(existingTags)
      .filter(tag => tag !== null);

    allTags.unshift('All');
    let uniqueTags = [...new Set(allTags)];
    return uniqueTags;
  }

  renderTags() {
    this.tagsUL.innerHTML = '';
    this.tags.forEach(tag => {
      let html = `<li><a href="${tag}" class="tag">${tag}</a></li>`;
      this.tagsUL.insertAdjacentHTML('beforeend', html);
    });
  }

  renderContacts(contacts) {
    contacts.forEach(contact => {
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
  <a href="/api/contacts/${contact.id}" class="edit">Edit</a>
  <a href="/api/contacts/${contact.id}" class="delete">Delete</a>
</div></li>`

    this.contactList.insertAdjacentHTML('beforeend', html);
    });
  }

  async valueChanged() {
    this.emptySearchPlaceholder.classList.add('hide');

    this.contactList.innerHTML = '';
    let value = this.input.value;
    if (value.length === 0) {
      this.renderContacts(this.contacts);
      return;
    }

    let matches = this.contacts.filter(contact => {
      return contact.full_name.toLowerCase().startsWith(value.toLowerCase());
    });

    if (matches.length > 0) {
      this.renderContacts(matches);
    } else {
      this.searchQuery.textContent = value;
      this.emptySearchPlaceholder.classList.remove('hide');
    }
  }

  renderContactForm(method, contact) {
    let html;
    let tags = [];
    if (contact && contact.tags) {
      tags = contact.tags.split(',');
    }

    let tagHTML = this.tags.map(tag => {
      if (tag !== 'All') {
        let checked = tags.includes(tag) ? 'checked' : '';
        return `<div><input type="checkbox" id="${tag}" name="tags" value="${tag}" ${checked}><label for="${tag}">  ${tag}</label></div>`
      }
    }).join('');

    if (method === 'post') {
      html = `<form action="/api/contacts" method="POST">
  <h3>Create Contact</h3>
  <label>
    Full name:
    <input type="text" name="full_name" id="full-name" required>
  </label>

  <label>
    Email address:
    <input type="email" name="email" id="email" required>
  </label>

  <label>
    Telephone number:
    <input type="text" name="phone_number" id="phone" required>
  </label>

  <fieldset class="tags-checkbox">
    ${tagHTML}
  </fieldset>

  <button type="submit" class="btn">Submit</button>
  <button type="reset" class="btn" id="cancel">Cancel</button>
</form>`
    } else if (method === 'put') {
      html = `<form action="/api/contacts/${contact.id}" method="post" data-method="PUT">
  <h3>Update Contact</h3>
  <input type="hidden" name="id" id="id" value="${contact.id}">
  <label>
    Full name:
    <input type="text" name="full_name" id="full-name" value="${contact.full_name}" required>
  </label>

  <label>
    Email address:
    <input type="email" name="email" id="email" value="${contact.email}" required>
  </label>

  <label>
    Telephone number:
    <input type="text" name="phone_number" id="phone" value="${contact.phone_number}" required>
  </label>

  <fieldset class="tags-checkbox">
    ${tagHTML}
  </fieldset>

  <button type="submit" class="btn">Submit</button>
  <button type="reset" class="btn" id="cancel">Cancel</button>
</form>`
    }

    this.formPlaceholder.innerHTML = html;
  }



  handleAddContactButton(event) {
    event.preventDefault();

    this.rowContainer.classList.add('hide');
    this.contactList.classList.add('hide');
    this.emptyContactsPlaceholder.classList.add('hide');
    this.emptySearchPlaceholder.classList.add('hide');
    this.renderContactForm('post');
  }

  handleEditContactButton(event) {
    event.preventDefault();
    let id = event.target.getAttribute('href').match(/\d+/g)[0];
    let contact = this.contacts.find(contact => contact.id == id);
    this.rowContainer.classList.add('hide');
    this.contactList.classList.add('hide');
    this.renderContactForm('put', contact);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new ContactManager();
});