var express = require("express"),
bodyParser = require("body-parser"),
fileSys = require("fs"),
multer = require("multer");

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({dest:'./uploads/'}).single("fle"));

app.get("/FileUpload.htm", function(req, res){
	res.sendFile(__dirname+"/"+"FileUpload.htm");
});

app.post("/file_upload", function(req, res){
	console.log(req.files.file.name);
	console.log(req.files.file.type);
	console.log(req.files.file.path);

	var file = __dirname+"/"+req.files.file.name;
	fs.readFile(req.files.file.path, function(err, data){
		fs.writeFile(file, data, function(err){
				if(err){
					console.log(err);
				}else{
					response={
						message:"FileUploaded successfully",
						filename:req.files.file.name
					};
				}
				console.log(response);
				res.end(JSON.stringify(response));
			});
	});
});

var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("server started at http://%s:%s", host, port);
});
