var mongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var isCountDone = false, isFindDone = false;
mongoClient.connect("mongodb://127.0.0.1:27017/test", function(err, db){
			if(err){
				console.log("error connecting test db "+err);
				throw err;
			}
			console.log("conn successfull!");
			var collection = db.collection('test_insert');
			collection.insert({a:3}, function(err, docs){
				collection.count(function(err, count){
					isCountDone = true;
					if(err)
						console.log("counting error ", err);
					else	
						console.log(format("count = %s", count));
					if(isFindDone){
						console.log("closing db after find and count.");
						db.close();
					}
				});
			});
			
			collection.find().toArray(function(err, result){
				isFindDone = true;
				console.dir(result);
				if(isCountDone){
					console.log("closing db after count and find.");
					db.close();
				}
			});
		});
