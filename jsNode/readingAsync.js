var fileStream = require("fs");
fileStream.readFile("sample.txt", function (err, data){
	if(err) return console.error("erro in reading file");
	console.log(data.toString());
});
console.log("ended");
