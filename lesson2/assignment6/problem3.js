Promise.resolve(1)                  // resolves to 1
  .then(number => (number * 2) + 5) // resolves to 7
  .then(number => (number * 2) + 5) // resolve  to 19
  .then(console.log)                // logs 19