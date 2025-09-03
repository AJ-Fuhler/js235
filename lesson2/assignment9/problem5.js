function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Data loaded");
      } else {
        reject("Network error");
      }
    }, 1000);
  });
}

function timeoutPromise(promise, ms) {
  let otherPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Operation timed out");
    }, ms);
  });

  return Promise.race([promise, otherPromise]);
}

timeoutPromise(loadData(), 500)
  .then(console.log)
  .catch(console.error);