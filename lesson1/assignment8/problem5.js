function startCounter(callback) {
  let count = 1;
  const intervalId = setInterval(() => {
    if (callback(count)) {
      clearInterval(intervalId);
    }

    count += 1
  }, 1000);

}

startCounter((count) => {
  console.log(count);
  return count === 5;
});