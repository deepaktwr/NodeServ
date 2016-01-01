var express = require("express");
var app = express();
app.use(express.static('jsAssets'));
app.get('/', function(req, res){
		console.log("having GET fro home");
		res.send("Yes?");
	});
app.get("/my_end_pont", function(req, res){
		console.log("having GET request from my_end_point end point");
		res.send("sending response to my_end_point GET request");
	});
app.post("/call_post", function(req, res){
		console.log("have POST requets from home");
		res.send("giving response to POST request at home");
	});
app.delete("/delete_user_from_list", function(req, res){
		console.log("have DELETE request from delete_user_from_list");
		res.send("user deleted");
	});

var mServer = app.listen(8080, function(){
		var host = mServer.address().address;
		var port = mServer.address().port;

		console.log("server is listening at http://%s:%s", host, port);
	});
