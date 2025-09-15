let bookingForm = document.getElementById('cancel_booking');
let scheduleForm = document.getElementById('cancel_schedule');

async function cancelBooking(event) {
  event.preventDefault();

  let bookingId = bookingForm.querySelector('#booking_id').value;
  let response = await fetch(`${bookingForm.action}/${bookingId}`, {
    method: 'PUT',
  });

  if (response.status === 204) {
    alert('Cancelled');
    bookingForm.reset();
  } else if (response.status === 404) {
    let message = await response.text();
    alert(message);
  }
}

async function cancelSchedule(event) {
  event.preventDefault();

  let scheduleId = scheduleForm.querySelector('#schedule_id').value;
  let response = await fetch(`${scheduleForm.action}/${scheduleId}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    alert('Cancelled');
    scheduleForm.reset();
  } else if (response.status === 403) {
    let message = await response.text();
    alert(message);
  }
}

function main() {
  document.addEventListener('submit', event => {
    if (event.target.id === 'cancel_booking') {
      cancelBooking(event);
    } else if (event.target.id === 'cancel_schedule') {
      cancelSchedule(event);
    }
  });

}

main();