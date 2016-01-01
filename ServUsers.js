var express = require("express");
var fs = require("fs");
var users = require("./FetchUsers.js");
var bodyParser = require("body-parser");
var app = express();
var response;

var urlEncodedParser = bodyParser.urlencoded({extended:true})
var jsonParser = bodyParser.json();
app.use(urlEncodedParser);
app.use(jsonParser);
var callback = function(data, respStatus){
	response.status(respStatus).send(data);
}

var getUsers = function(req, res){
		response = res;
		users.getAllUsers(fs, callback);
	}
var getUser = function(req, res){
		response = res;
		var data = req.body;
		if(data.hasOwnProperty('user_name'))
			users.getUserDetails(fs, data['user_name'], callback);
		else{
			rspns={
			'status':'0',
			'error':'invalide request'
			}
			res.status(400).send(rspns);
		}
	}
app.get("/get_users", getUsers);
app.post("/get_user", getUser);

var server = app.listen(8080, function(){
	var address = server.address().address;
	var port = server.address().port;
	console.log("server is at http://%s:%s", address, port);
});

