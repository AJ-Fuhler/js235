let form = document.querySelector('form');
let addButton = document.getElementById('btnAdd');
let schedules = document.getElementById('schedules');
let scheduleNumber = 0;
let staffMembers;

async function fetchStaffMembers() {
  let response = await fetch('/api/staff_members');
  return response.json();
}

async function generateScheduleHTML() {
  scheduleNumber += 1;
  let options = [];

  for (let staffMember of staffMembers) {
    let option = `<option value="${staffMember.id}">${staffMember.name}</option>`;
    options.push(option);
  }

  let html = `<fieldset id="schedule_${scheduleNumber}">
  <legend>Schedule ${scheduleNumber}</legend>

  <div>
    <label for="staff_${scheduleNumber}">Staff Name:</label>
    <select id="staff_${scheduleNumber}" name="staff_${scheduleNumber}">${options.join('')}</select>
  </div>

  <div>
    <label for="date_${scheduleNumber}">Date:</label>
    <input type="text" id="date_${scheduleNumber}" name="date_${scheduleNumber}" placeholder="mm-dd-yy">
  </div>

  <div>
    <label for="time_${scheduleNumber}">Time:</label>
    <input type="text" id="time_${scheduleNumber}" name="time_${scheduleNumber}" placeholder="hh:mm">
  </div>

  </fieldset>`

  schedules.insertAdjacentHTML('beforeend', html);
}

async function submitForm(event) {
  event.preventDefault();

  let schedules = [];
  let fieldsets = form.querySelectorAll('fieldset');
  for (let fieldset of fieldsets) {
    let scheduleNumber = fieldset.id.replace(/\D+/g, '');
    schedules.push({
      'staff_id': document.getElementById(`staff_${scheduleNumber}`).value,
      date: document.getElementById(`date_${scheduleNumber}`).value,
      time: document.getElementById(`time_${scheduleNumber}`).value,
    });
  }

  let json = JSON.stringify({'schedules': schedules});
  let response = await fetch(form.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json,
  });

  let message = await (response.text());

  if (response.status === 400) {
    alert(message);
  }

  if (response.status === 201) {
    alert(message);
    form.reset();
  }
}

async function main() {
  staffMembers = await fetchStaffMembers();
  addButton.addEventListener('click', generateScheduleHTML);
  form.addEventListener('submit', submitForm);
}


main();