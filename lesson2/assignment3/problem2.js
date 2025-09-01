function washLaundry() {
  console.log("Putting clothes in wash.");
  console.log("Adding soap.");

  console.log("Washing laundry...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Buzz!');
      resolve();
    }, 5000);
  });
}

function bakeCookies() {
  console.log("Mixing ingredients.");
  console.log("Scooping cookie dough.");
  console.log("Putting cookies in oven.");

  console.log("Baking...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Beep!");
      resolve();
    }, 3000);
  });
}

function doChores() {
  washLaundry().then(() => {
    console.log("Folding Laundry.");
    console.log("Putting away Laundry.");
  });

  bakeCookies().then(() => {
    console.log("Cooling cookies.");
    console.log("Eating cookies.");
  });
}

doChores();