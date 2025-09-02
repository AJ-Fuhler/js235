function flakyService() {
  const rand = Math.random();

  return new Promise((resolve, reject) => {
    if (rand > 0.5) {
      resolve('Operation successful');
    } else {
      reject('Operation failed');
    }
  });
}

flakyService().then(console.log).catch(console.error);