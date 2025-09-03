function downloadFilePromise() {
  return new Promise((resolve) => {
    console.log("Downloading file...");
    setTimeout(() => {
      resolve("Download complete!");
    }, 1500);
  });
}

async function asyncDownloadFile() {
  console.log("Downloading file...");
  let message = await new Promise((resolve) => {
    setTimeout(() => {
      resolve("Download complete!");
    }, 1500);
  });

  console.log(message);
}

asyncDownloadFile();