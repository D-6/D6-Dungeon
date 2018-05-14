const path = require('path');
const fs = require('fs');

const pathToReference = path.join(
  __dirname,
  '..',
  'client',
  'rooms',
  'level1/'
);
const referenceFile = 'level1_0.js';
const otherFiles = [
  'level1_1.js',
  'level1_2.js',
  'level1_3.js',
  'level1_4.js',
  'level1_5.js',
  'level1_6.js',
  'level1_7.js'
];

// Overwrite the level files with the contents of level1_0
const writeLevelFiles = () => {
  var contents = fs.readFileSync(pathToReference + referenceFile);
  otherFiles.forEach(file => {
    fs.writeFileSync(pathToReference + file, contents);
  });
};

module.exports = writeLevelFiles;
