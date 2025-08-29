console.log('Starting...');

let id = setInterval(() => {
  console.log('Hello!');
}, 2000);

setTimeout(() => {
  clearInterval(id);
  console.log('Goodbye!');
}, 10000);