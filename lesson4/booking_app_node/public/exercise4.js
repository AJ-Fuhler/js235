let main = document.querySelector('main');
let scheduleForm = document.querySelector('form');
let scheduleSelect = document.getElementById('id');
let studentForm = document.getElementById('student_form');
let staffMembers;

async function fetchStaffMembers() {
  let response = await fetch('/api/staff_members');
  staffMembers = await response.json();
}

function getStaffNameById(id) {
  return staffMembers.find(staffMember => staffMember.id === id).name;
}


async function loadSchedules() {
  let response = await fetch('/api/schedules');
  let schedulesArray = await response.json();

  for (let schedule of schedulesArray) {
    if (!schedule.student_email) {
      // option value = id  |||Teacher name | Date | Time
      let staffName = getStaffNameById(schedule.staff_id);
      let optionHTML = `<option value="${schedule.id}">${staffName} | ${schedule.date} | ${schedule.time}</option>`;
      scheduleSelect.insertAdjacentHTML(`beforeend`, optionHTML);
    }
  }
}

async function handleScheduleForm(event) {
  event.preventDefault();

  let formData = new FormData(scheduleForm);
  let formObject = Object.fromEntries(formData.entries());
  let json = JSON.stringify(formObject);

  let response = await fetch(scheduleForm.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json,
  });

  if (response.status === 204) {
    alert('Booked');
    scheduleForm.reset();
    scheduleForm.querySelector('button').disabled = false;
    return;
  }

  let responseBody = await response.text();
  let bookingSequence = responseBody.replace(/\D+/g, '');

  alert(responseBody);
  scheduleForm.querySelector('button').disabled = true;
  loadNewStudentForm(formObject, bookingSequence);
}

function loadNewStudentForm(formObject, bookingSequence) {
  let email = formObject.student_email;
  let formHTML = `<form action="/api/students">
  <legend>Please provide new student details</legend>
  <label>
    Email:
    <input type="email" id="email" name="email" value="${email}">
  </label>
  <label>
    Name:
    <input type="text" id="name" name="name">
  </label>
  <label>
    Booking Sequence
    <input type="text" id="booking_sequence" name="booking_sequence" value="${bookingSequence}">
  </label>
  <button type="submit">submit</button>
</form>`

studentForm.innerHTML = formHTML;
}

async function handleStudentForm(event) {
  event.preventDefault();

  let form = event.target;
  let formData = new FormData(form);
  let formObject = Object.fromEntries(formData.entries());
  let json = JSON.stringify(formObject);

  let response = await fetch(form.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: json,
  });

  let responseBody = await response.text();

  if (response.status === 201) {
    alert(responseBody);
    form.reset();
    await handleScheduleForm(new Event('submit', {cancelable: true, target: scheduleForm}));
    return;
  }

  alert(responseBody);
}

async function init() {
  await fetchStaffMembers();
  await loadSchedules();
  main.addEventListener('submit', event => {
    if (event.target.matches('form[action="/api/bookings"]')) {
      handleScheduleForm(event);
    } else if (event.target.matches('form[action="/api/students"]')) {
      handleStudentForm(event);
    }
  });
}

init();