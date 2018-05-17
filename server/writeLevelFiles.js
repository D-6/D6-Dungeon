const path = require('path');
const fs = require('fs');

const pathToReference = path.join(__dirname, '..', 'client', 'rooms/');
const referenceFile = 'level1/level1_0.js';
const otherFiles = [
  'level1/level1_1.js',
  'level1/level1_2.js',
  'level1/level1_3.js',
  'level1/level1_4.js',
  'level1/level1_5.js',
  'level1/level1_6.js',
  'level1/level1_7.js',
  'level2/level2_0.js',
  'level2/level2_1.js',
  'level2/level2_2.js',
  'level2/level2_3.js',
  'level2/level2_4.js',
  'level2/level2_5.js',
  'level2/level2_6.js',
  'level2/level2_7.js',
  'level2/level2_8.js',
  'level2/level2_9.js',
  'level2/level2_10.js',
  'level2/level2_11.js',
  'level3/level3_0.js',
  'level3/level3_1.js',
  'level3/level3_2.js',
  'level3/level3_3.js',
  'level3/level3_4.js',
  'level3/level3_5.js',
  'level3/level3_6.js',
  'level3/level3_7.js',
  'level3/level3_8.js',
  'level3/level3_9.js',
  'level3/level3_10.js',
  'level3/level3_11.js',
  'level3/level3_12.js',
  'level3/level3_13.js',
  'level3/level3_14.js',
  'level3/level3_15.js'
];

// Overwrite the level files with the contents of level1_0
const writeLevelFiles = () => {
  const contents = fs.readFileSync(pathToReference + referenceFile);
  const level2Dir = path.join(pathToReference, 'level2');
  const level3Dir = path.join(pathToReference, 'level3');

  if (!fs.existsSync(level2Dir)) {
    fs.mkdirSync(level2Dir);
  }

  if (!fs.existsSync(level3Dir)) {
    fs.mkdirSync(level3Dir);
  }

  otherFiles.forEach(file => {
    fs.writeFileSync(pathToReference + file, contents);
  });
};

module.exports = writeLevelFiles;
