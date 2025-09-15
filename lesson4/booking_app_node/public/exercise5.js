let bookingDates;
let bookingDetails;
let bookingsUL = document.getElementById('bookings');

async function fetchDatesWithBookings() {
  let response = await fetch('/api/bookings');
  return response.json();
}

async function fetchBookingDetailsByDate(date) {
  let response = await fetch(`/api/bookings/${date}`);
  return response.json();
}

async function generateBookingDates() {
  bookingDates = await fetchDatesWithBookings();
  for (let date of bookingDates) {
    let li = document.createElement('li');
    li.textContent = date;
    li.setAttribute('data-date', date);
    bookingsUL.appendChild(li);
  }
}


async function generateBookingDetailsHTML(outerLI, date) {
  let bookingDetails = await fetchBookingDetailsByDate(date);
  let innerUL = document.createElement('ul');
  innerUL.classList.add('show');

  function generateSingleLi(booking) {
    let li = document.createElement('li');
    li.textContent = booking.join(' | ');
    innerUL.appendChild(li);
  }

  if (Array.isArray(bookingDetails[0])) {
    for (let booking of bookingDetails) {
      generateSingleLi(booking);
    }
  } else {
    generateSingleLi(bookingDetails);
  }

  outerLI.appendChild(innerUL);
}

async function main() {
  await generateBookingDates();
  bookingsUL.addEventListener('click', async event => {
    if (event.target.tagName === 'LI' && event.target.parentNode === bookingsUL) {
      let outerLI = event.target;
      let innerUL = outerLI.querySelector('ul');
      if (innerUL) {
        innerUL.classList.toggle('show');
        return;
      }
      await generateBookingDetailsHTML(outerLI, outerLI.dataset.date);
    }
  });
}

main();