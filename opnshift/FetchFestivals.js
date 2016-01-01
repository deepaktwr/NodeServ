var festCallback = function(err, data, serverCallback, dbObject){
                if(err){
                        console.log("error reading file : "+err);
                        var fests = {
                                'status':'0',
                                'message':'no events found'
                        };
                        serverCallback(fests, 400);
                        return;
                }
		var festsColl = dbObject.collection('fests');
                var fests = JSON.parse(data);

		festsColl.insert(fests, function(err, docs){
	                if(err){
                        console.log("error reading file : "+err);
                        var fests = {
                                'status':'0',
                                'message':'no events found'
                        };
                        serverCallback(fests, 400);
                        return;
                	}

		         festsColl.find().toArray(function(err, result){
			if(err || result.length==0){
                        console.log("error reading file : "+err);
                        var fests = {
                                'status':'0',
                                'message':'no events found'
                        };
                        serverCallback(fests, 400);
                        return;
                        }

                        var fests = {
                               	'status':'1',
                               	'message':'success',
				'fests':result[0]
                        }	;
                        serverCallback(fests, 200);

                        });
		});
        }
exports.getAllFestivals = function(fs, serverCallback, dbObject){
			var festsColl = dbObject.collection('fests');
                         festsColl.find().toArray(function(err, result){
                        	if(err || result.length==0){
                        	         fs.readFile("festivals.json", "utf8", function(err, data){
                	        	festCallback(err, data, serverCallback, dbObject);
		                	});
                        	}else{
                        	var fests = {
                                	'status':'1',
                                	'message':'success',
                                	'fests':result[0]
                        	};
                        	serverCallback(fests, 200);

                        	}
				});
			}


