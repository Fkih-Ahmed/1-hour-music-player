const fs = require('fs');
const path = require('path');

const directoryPath = './music/';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory ${directoryPath}: ${err}`);
    return;
  }

  const fileNames = files.filter(file => path.extname(file) !== '')
                         .map(file => path.parse(file).name.toLowerCase());

  const json = JSON.stringify({ songs: fileNames }, null, 2);

  fs.writeFile('playlist.json', json, 'utf8', err => {
    if (err) {
      console.error(`Error writing file: ${err}`);
    } else {
      console.log('File written successfully');
    }
  });
});
