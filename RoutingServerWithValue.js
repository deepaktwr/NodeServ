var express = require("express");
var app = express();

app.get("/PassForm.htm", function(req, res){
        res.sendFile(__dirname+"/"+"PassForm.htm");
});
app.get("/fill_form", function(req, res){
        response={
                firstName:req.query.first_name,
                lastName:req.query.last_name
        }
        console.log(response);
        res.end(JSON.stringify(response));
});


var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended:false});

app.get("/PassFormPost.htm", function(req, res){
	res.sendFile(__dirname+"/"+"PassFormPost.htm");
});

app.post("/fill_form_post", urlEncodedParser, function(req, res){
	response={
		firstName:req.body.first_name,
		lastName:req.body.last_name
	}
	console.log(response);
	res.end(JSON.stringify(response));
});


var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("server started at http://%s:%s", host, port);	
});
