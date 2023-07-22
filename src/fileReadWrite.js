/// Dependencies
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

/// Functionalities
//CSV read write
function saveArrayAsCSV(array, filePath, fileName) {
  // Create the CSV content
  let csvContent = "";
  const headers = Object.keys(array[0]).join(",") + "\n";
  csvContent += headers;

  array.forEach((obj) => {
    const values = Object.values(obj).join(",") + "\n";
    csvContent += values;
  });

  // Save the CSV file
  const fullFilePath = `${filePath}/${fileName}.csv`;
  fs.writeFileSync(fullFilePath, csvContent);

  console.log(`CSV file saved at: ${fullFilePath}`);
}
async function readCSV(filePath, orig2ComprColNameMapping) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      // .pipe(csv())
      .pipe(csv({ mapValues: ({ value }) => isNaN(Number(value)) ? value : Number(value) }))
      .on("data", (data) => {
        const newObj = {};
        for (const prop in data) {
          if (orig2ComprColNameMapping.hasOwnProperty(prop)) {
            newObj[orig2ComprColNameMapping[prop]] = data[prop];
          }
          // else {
          //     newObj[key] = testObj[key];
          // }
        }

        results.push(newObj);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}
async function readCSVAsObjects(filePath,orig2ComprColNameMapping) {
  try {
    filePath = filePath + ".csv";
    const rows = await readCSV(filePath,orig2ComprColNameMapping);
    if (rows.length === 0) {
      console.warn("CSV file is empty");
      return [];
    }
    console.log(rows[0]);
    console.log(rows[1]);
    const columnNames = Object.keys(rows[0]);

    const objects = rows;
    // rows.map((row) => {
    //   const obj = {};
    //   columnNames.forEach((columnName) => {
    //     obj[columnName] = row[columnName];
    //   });
    //   return obj;
    // });
    return objects;
  } catch (error) {
    console.error("Error converting CSV to objects:", error);
    return [];
  }
}
async function fetchPlainColNamesFromCSV(csvFilePath) {
  csvFilePath = csvFilePath + ".csv";

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath).pipe(csv());
    stream.on("data", (row) => {
      const columns = Object.keys(row);
      const colNamesOrigiAndCompressed = {};
      const uniColNames = new Set();
      // console.log("org col names >>");
      for (let col of columns) {
        // console.log(col);
        const uName = col.replace(/\s/g, "").toLowerCase(); //removes all occurances of whitespaces (spaces,tabs, linebreaks) from everywhere in the string
        colNamesOrigiAndCompressed[col] = uName;
        uniColNames.add(uName);
      }
      // console.log("unique col names >>");
      // console.log(uniColNames)
      // Stop the stream and resolve the promise
      stream.destroy();
      resolve({
        orig2CompMap: colNamesOrigiAndCompressed, //mapping of original to compressed column names
        uniCompColNames: uniColNames}); //set of unique compressed column names
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}
//Excel .xlsx read write
function readExcelFileAsObjects(filePath) {
  // const filePath = path.join(__dirname, filePath);
  filePath = filePath + ".xlsx";

  // Read the Excel file
  const workbook = XLSX.readFile(filePath);

  // Get the first sheet name
  const sheetName = workbook.SheetNames[0];

  // Get the worksheet
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to JSON object
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Map the JSON data to array of objects
  const objectsArray = jsonData.map((row) => {
    const obj = {};
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        obj[key] = row[key];
      }
    }
    return obj;
  });
  return objectsArray;
}

/// Exports
module.exports = {
 readExcelFileAsObjects,
 saveArrayAsCSV,
 readCSVAsObjects,
 fetchPlainColNamesFromCSV
}

/// Dummy testing

// (async () => {
//   const filePath = 'D:/TrueReach/TestCSV/qmatch_act';
//   let objects = await readCSVAsObjects(filePath);
//   console.log(" final objects >>");
//   console.log(objects)
// })()
//Excel .xlsx read write

// Usage example
// async function main() {
//   try {
//     const path = "D:/TrueReach/TestCSV/qmatch_act";
//     const uColNames = await fetchPlainColNamesFromCSV(path);
//     console.log(uColNames);
//     const objects = await readCSVAsObjects(path, uColNames);
//     console.log(objects);
//     // Do further processing with the first row as an object
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// main();

//write the skeleton of a function that takes a csv file's path as an input and gives an array of objects as output.Remember that the first line of csv is the column names. There column names would be the property names of the objects and each rows would would be an object. The values in columns for each row would be the property values for the related object.Use standard well tested nodejs libraries if you needs. Remember I am using js for nodejs, not ts. Also use async/await syntax rather than promises or callbacks for any asynchronous processing. Make it really well performant
// console.log(readExcelFileAsObjects("D:/TrueReach/TestFiles/example_bench.xlsx"))
//console.log(readExcelFileAsObjects("example.xlsx"));

// // Example usage
// const data = [
//   { id: 1, name: 'John', age: 25 },
//   { id: 2, name: 'Jane', age: 30 },
//   { id: 3, name: 'Tom', age: 35 }
// ];
// const path = 'D:/TrueReach/TestFiles';
// const fileName = 'dummycsv';

// saveArrayAsCSV(data, path, fileName);

// (async () => {
//   const filePath = 'D:/TrueReach/results';

//   try {
//     const objects = await readCSVAsObjects(filePath);
//     console.log(objects);
//   } catch (error) {
//     console.error('Error processing CSV file:', error);
//   }
// })();
