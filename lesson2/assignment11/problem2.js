function processDataPromise(numbers, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const processed = numbers.map(callback);
      resolve(processed);
    }, 1000);
  });
}

async function processNTimes(numbers, callback, n) {
  let count = 0;

  async function process() {
    if (count >= n) {
      return Promise.resolve(numbers);
    }
    await processDataPromise(numbers, callback).then(result => {
      numbers = result;
    });
    count += 1;
    return process();
  }

  process().then(console.log);
}

const squareIt = (n) => n * n;
processNTimes([1, 2, 3], squareIt, 3);

// LS solution (much simpler):

async function processNTimes(numbers, callback, n) {
  for (let i = 0; i < n; i += 1) {
    numbers = await(processDataPromise(numbers, callback));
  }

  console.log(numbers);
}