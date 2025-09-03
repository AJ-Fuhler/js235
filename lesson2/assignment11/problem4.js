function petCat() {
  return new Promise(resolve => {
    console.log("Petting cat...");
    setTimeout(resolve, 5000);
  });
}

function getDressed() {
  return new Promise(resolve => {
    console.log("Getting dressed...")
    setTimeout(resolve, 3000);
  });
}

function brushTeeth() {
  return new Promise(resolve => {
    console.log("Brushing teeth...");
    setTimeout(resolve, 2000);
  });
}

async function getReady() {
  console.log("Good morning!");
  await petCat();
  await getDressed();
  await brushTeeth();
  console.log("I'm ready!");
}

async function makeCoffee() {
  console.log("Starting coffee...");
  await new Promise(resolve => setTimeout(resolve, 3500));
  console.log("Coffee is ready.")
}

getReady();
makeCoffee();