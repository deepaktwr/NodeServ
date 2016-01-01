var express = require('express');
var app = express();
app.get('/serv_htm.htm', function(req, res){
	res.send("Hello");
	});
var server = app.listen(8080, function(){
		var host = server.address().address;
		var port = server.address().port;

		console.log("app is listening at http://%s:%s", host, port);
	});
