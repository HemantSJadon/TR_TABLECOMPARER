/// Dependencies
const fs = require('fs');
const path = require('path');

/// Functionalities
function getUniqueFileBaseNames(folderPath) {
  const fileNames = fs.readdirSync(folderPath);
  const uniqueNames = new Set();

  fileNames.forEach(fileName => {
    const name = fileName.split('_')[0];
    uniqueNames.add(name);
  });

  return Array.from(uniqueNames);
}
function readPairsWithCommonBaseName(folderPath){
  const uniqueNames = getUniqueFileBaseNames(folderPath);
  const pairs = [];//
  uniqueNames.forEach(n => {
    let benchmarkFilePath = folderPath + "/" + n + "_" +"bench"; //reconstructing file name here
    let actualFilePath = folderPath + "/" + n + "_" +"test";
    pairs.push([n,benchmarkFilePath,actualFilePath]);
  })
  return pairs;
}

/// Exports
module.exports = {readPairsWithCommonBaseName}

/// Dummy testing
// const folderPath = 'D:/TrueReach/TestFiles';
// const uniqueNames = getUniqueNamesFromFolder(folderPath);
// console.log(uniqueNames);