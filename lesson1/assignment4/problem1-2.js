function startCounting() {
  let number = 1;
  return setInterval(() => {
    console.log(number);
    number += 1;
  }, 1000);
}

let id = startCounting();

function stopCounting() {
  clearInterval(id);
}


setTimeout(stopCounting, 11000);