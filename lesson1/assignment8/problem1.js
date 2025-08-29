function basicCallback(callback, num) {
  setTimeout(() => {
    callback(num);
  }, 2000);
}