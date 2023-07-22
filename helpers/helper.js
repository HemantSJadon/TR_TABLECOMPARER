const readline = require("readline");

async function askFolderPath() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question("Enter folder path here >>", (fpath) => {
      resolve(fpath);
      rl.close();
    });
  });
}

function isAnyBenchColumnMissing(comprColNameSet_bench, comprColNameSet_test) {
  for (let col of comprColNameSet_bench) {
    if (!comprColNameSet_test.has(col)) return true;
  }
  return false;
}
function discardExtraTestColumns(orig2CompMap_test, comprColNameSet_bench) {
  const orig2CompMap_testNew = {};
  for (let origColName in orig2CompMap_test) {
    let isExtraCol = !comprColNameSet_bench.has(orig2CompMap_test[origColName]);
    if (!isExtraCol)
      orig2CompMap_testNew[origColName] = orig2CompMap_test[origColName];
  }
  return orig2CompMap_testNew;
}
function isMissingRowsForSure(benchArray, testArray){
  if (benchArray.length > testArray.length) {
    return true;
  }
  return false;
}

module.exports = { 
    askFolderPath,
    isAnyBenchColumnMissing,
    discardExtraTestColumns,
    isMissingRowsForSure
 };
