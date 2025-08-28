function delayLog() {
  for (let seconds = 1; seconds <= 10; seconds += 1) {
    setTimeout(() => {
      console.log(seconds)
    }, seconds * 1000);
  }
}

delayLog();