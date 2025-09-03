async function petCat() {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve("Petting cat...");
    }, 5000);
  });
}

async function getDressed() {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve("Getting dressed...");
    }, 3000);
  });
}

async function brushTeeth() {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve("Brushing teeth...")
    }, 2000)
  });
}

async function getReady() {
  console.log("Good morning!");
  await petCat().then(console.log);
  await getDressed().then(console.log);
  await brushTeeth().then(console.log);
  console.log("I'm ready!");
}

getReady();