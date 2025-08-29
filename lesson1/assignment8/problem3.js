function processData(numbersArr, callback) {
  setTimeout(() => {
    console.log(numbersArr.map(callback));
  }, 1000);
}