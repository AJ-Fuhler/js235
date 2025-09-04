function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject("Operation failed");
    }
  });
}

async function useFlakyService() {
  try {
    let result = await flakyService();
    console.log(result);
  } catch(error) {
    console.error(error);
  }
}

useFlakyService();