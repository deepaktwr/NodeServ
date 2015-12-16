var sys = require("sys");
var mHttp = require("http");
var path = require("path");
var url = require("url")
var fileSys = require("fs");

mHttp.createServer(function(request, response){
	var myPath = url.parse(request.url).pathname;
	var fullPath = path.join(process.cwd(), myPath);

	path.exists(fullPath, function(exists){
		if(!exists){
			response.writeHeader(404, {"Content-Type": "text/plain"});
			response.write("404");
			response.end();
		}else{
			fileSys.readFile(fullPath, function(err, data){
				if(err){
					response.writeHeader(500, {"Content-Type": "text/plain"});
					response.write(err+"\n");
					response.end();
				}else{
					response.writeHeader(200);
					response.write(data, "binary");
					response.end();
				}
			});
		}
	})
}).listen(8080);
sys.puts("server unning at 8080");
