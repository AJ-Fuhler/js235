Promise.resolve("Operation complete").then(console.log).finally(() => {
  console.log("cleaning up resources...");
});

// or

function operation() {
  return new Promise((resolve, reject) => {
    console.log("Operation started");
    setTimeout(() => {
      resolve("Operation complete");
    }, 1000);
  });
}

operation()
  .then(console.log)
  .finally(() => {
    console.log("Cleaning up resources...");
  });