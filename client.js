var http = require("http");
var sys = require("sys");
var options = {
	host: '0.0.0.0',
	port: '8080',
	path: '/serv_htm.htm'
};
var callbackClient = function(response){
	var myBody = '';
	response.on('data', function(data){
		myBody+=data;
	});
	response.on('end', function(){
		console.log(myBody);
		sys.puts("data");
	});
}
var req = http.request(options, callbackClient);
req.end();
