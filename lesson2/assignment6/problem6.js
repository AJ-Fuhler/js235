function mockAsyncOp() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Operation succeeded");
      } else {
        reject("Operation failed");
      }
    }, 1000);
  });
}

mockAsyncOp()
  .then(console.log)
  .catch(console.error)
  .finally(() => console.log("Operation attempted"));