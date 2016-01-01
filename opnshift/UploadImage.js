var uploadCallback = function(err, data, fileName, filePath, serverCallback, fs){
			var file ="./public/uploads/"+fileName;
			fs.writeFile(file, data, function(err){
				response={
					"status":'0',
					"result":"Upload Failed"
					}
				var respStatus = 400;
				if(err)
					console.log("writing file error:"+err);
				else{
					response={
					"status":"1",
					"result":file+" uploaded successfully!"
					}
					respStatus = 200;
				}
				serverCallback(response, respStatus);
			});
		}

exports.uploadFile = function(fileName, filePath, serverCallback, fs){
			fs.readFile(filePath, function(err, data){
				uploadCallback(err, data, fileName, filePath, serverCallback, fs);
			});
		}
