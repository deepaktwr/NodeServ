var fileStream = require("fs");
var fileData = fileStream.readFileSync("sample.txt");
console.log(fileData.toString());
console.log("ended");
