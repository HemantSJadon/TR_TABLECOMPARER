/// Dependencies

/// Functionalities
function getRangeForTestfp(number) {
  const numberString = number.toString();
  const [wholePart, decimalPart] = numberString.split(".");
  const precision = decimalPart.length;
  let next = number /* parseFloat(numberString) */ + Math.pow(10, -precision);
  let prev = number - Math.pow(10, -precision);
  next = Number(next.toFixed(precision));
  prev = Number(prev.toFixed(precision));
  console.log({ min: prev, max: next });
  return { min: prev, max: next };
}
function matchValsForCommonKeys(benchObj, testObj) {
  for (let key in benchObj) {
    console.log(key);
    let benchVal = benchObj[key];
    let testVal = testObj[key];
    const areDifferentTypes = typeof benchVal !== typeof testVal;
    const areBothNumbers =
      typeof benchVal === "number" && typeof testVal === "number";
    const areBothIntegers =
      areBothNumbers && Number.isInteger(benchVal) && Number.isInteger(testVal);
    const areBothFloatingPoints =
      areBothNumbers &&
      !Number.isInteger(benchVal) &&
      !Number.isInteger(testVal);
    if (areDifferentTypes) return false;
    if (areBothIntegers) {
      if (benchVal !== testVal) return false;
      continue;
    }
    if (areBothFloatingPoints) {
      const acceptableRange = getRangeForTestfp(benchVal);
      if (testVal > acceptableRange.max || testVal < acceptableRange.min)
        return false;
      continue;
    }
    //If the code reaches here, means both are texts
    benchVal = benchVal.replace(/\s/g, "").toLowerCase(); //removes all whitespaces and makes lowercase
    testVal = testVal.replace(/\s/g, "").toLowerCase();
    console.log(benchVal);
    console.log(testVal);
    if (benchVal !== testVal) return false;
  }
  return true;
}
function isMissingRowsForSure(benchArray, testArray){
  if (benchArray.length > testArray.length) {
    return true;
  }
  return false;
}
function matchObjInArray(obj, arrToTraverse, indicesToSkip){
  //return true/false. if match found, add that array index to the set of indices to skip and quit further searching
  for (let i = 0; i < arrToTraverse.length; i++) {
    if(indicesToSkip.has(i)) continue;
    isAnyMatch = matchValsForCommonKeys(obj, arrToTraverse[i]);
    if (isAnyMatch) {
      indicesToSkip.add(i); //one test obj can be matched with at most one bo
      return true;
    }
  }
  return false;
}
function doArraysMatch(benchArray, testArray) {
  const matchedIndicesInTest = new Set();
  for (let bo of benchArray) {
    let isAnyMatch = matchObjInArray(bo, testArray, matchedIndicesInTest);
    if (!isAnyMatch) {
      const unmatchedStringifiedRow = JSON.stringify(bo).replace(/,\s*"/g,' "');
      return {
        isMatch: false,
        message: `Following row from benchmark was unmatched in test data >> ${unmatchedStringifiedRow}`
      };
    } //a benchmark object can not be left unmatched for 2 arrays to be equal
  }
  return {
    isMatch: true,
    message: "Matched >>"
  };
}
function doSortedArraysMatch(benchArray, testArray){
  for(let i = 0; i < benchArray.length; i++){
    let isMatch = matchValsForCommonKeys(benchArray[i], testArray[i]);
    if(!isMatch){
      const unmatchedStringifiedRow = JSON.stringify(bo).replace(/,\s*"/g,' "');
      return  {
        isMatch: false,
        message: `Following row from sorted benchmark was unmatched in sorted test data >> ${unmatchedStringifiedRow}`
      }
    }
  }
  return {
    isMatch: true,
    message: "Matched >>"
  };
}

/// Exports
module.exports = {
  doArraysMatch,
  doSortedArraysMatch,
};

/// Dummy testing
// Example usage
//   const arr1 = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
//   const arr2 = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];

//   const result = compareArrays(arr1, arr2);
//   console.log(result);

// Test objects
// const benchObj = {
//   name: "John Doe",
//   age: 30,
//   height: 180.5,
// };

// const testObj1 = {
//   name: "john doe",
//   age: 30,
//   height: 180.6,
// };

// const testObj2 = {
//   name: "John Doe",
//   age: 29,
//   height: 180.5,
// };

// const testObj3 = {
//   name: "John Doe",
//   age: 30,
//   height: 180.5,
// };

// // Test function
// console.log(matchValsForCommonKeys(benchObj, testObj1)); // Output: true
// console.log(matchValsForCommonKeys(benchObj, testObj2)); // Output: true
// console.log(matchValsForCommonKeys(benchObj, testObj3)); // Output: true

