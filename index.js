/// Dependencies 

const readline = require("readline");
const fileRW  =  require('./src/fileReadWrite.js');
const comparer  =  require('./src/equalityComparer.js');
const {readPairsWithCommonBaseName}  =  require('./src/pairIdentifier.js');
const helper = require('./helpers/helper.js')

async function compareEachPair(filePairs, isSorted) {
  let comparisonResults = [];
  for (const pair of filePairs) {
    let isAMatch = true;
    let remark = '';
    let benchFileName = pair[1], testFileName = pair[2];
    const benchColNames = await fileRW.fetchPlainColNamesFromCSV(benchFileName);
    const testColNames = await fileRW.fetchPlainColNamesFromCSV(testFileName);
    const isBenchColumnMissing = helper.isAnyBenchColumnMissing(benchColNames.uniCompColNames, testColNames.uniCompColNames);
    if (isBenchColumnMissing) {
      isAMatch = false;
      remark += "missing benchmark columns >>";
    }
    else {
      const benchmarkArray = await fileRW.readCSVAsObjects(benchFileName, benchColNames.orig2CompMap);
      console.log(benchmarkArray);
      testColNames.orig2CompMap = helper.discardExtraTestColumns(testColNames.orig2CompMap, benchColNames.uniCompColNames);
      const testArray = await fileRW.readCSVAsObjects(testFileName, testColNames.orig2CompMap);
      console.log(testArray);
      let isMissingRows = helper.isMissingRowsForSure(benchmarkArray, testArray);
      if(isMissingRows){
        isAMatch = false;
        remark += "Some benchmarks rows are missing in test data >>";
      }
      else {
        let matchResult = isSorted ? comparer.doSortedArraysMatch(benchmarkArray, testArray) : comparer.doArraysMatch(benchmarkArray, testArray);
        isAMatch = matchResult.isMatch;
        remark = matchResult.message;
      }
    }
    comparisonResults.push({
      fileName: pair[0],
      isAMatch: isAMatch ? "T" : "F",
      remark: remark
    });
  }
  // console.log("comparision >>");
  // console.log(comparisonResults);
  return comparisonResults; //Promise.resolve(comparisonResults);;
}

async function main() {
  let folderPath = 
  // await helper.askFolderPath();
  "D:/TrueReach/AtomicTests/Files";
  // "D:/TrueReach/AtomicTests/Files/iso";
  let filePairs = [];
  // console.log(`your path: ${folderPath}`);
  filePairs = readPairsWithCommonBaseName(folderPath);
  let results = await compareEachPair(filePairs,false); //collection of result objects, each object contains the comparision result of a pair along with its command name
  console.log(results);
  fileRW.saveArrayAsCSV(results,"D:/TrueReach/AtomicTests/Results","results");
  // console.log(results);
}

main().catch((error) => {
  console.error(error);
  // rl.close();
});


// console.log(__dirname);