function processData(numbers, callback) {
  setTimeout(() => {
    const processed = numbers.map(callback);
    console.log(processed);
  }, 1000);
}

// Example usage:
processData([1, 2, 3], (number) => number * 2);
// After 1 second, logs: [2, 4, 6]

function processDataPromise(numbers, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(numbers.map(callback));
    }, 1000);
  });
}

processDataPromise([1, 2, 3], (number) => number * 2).then((processedNumbers) => {
  console.log(processedNumbers);
});

