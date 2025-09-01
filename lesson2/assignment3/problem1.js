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