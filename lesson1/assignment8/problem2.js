function downloadFile(callback) {
  console.log('Downloading file...');

  setTimeout(() => {
    callback('Download complete!');
  }, 1500);
}