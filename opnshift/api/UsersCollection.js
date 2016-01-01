var keyUserName = 'username';
var keyFirstName = 'firstname';
var wipeAllData = function(serverCallback, dbObject, userObject){
			var userColl = dbObject.collection('users');
                        userColl.find({'username':userObject['username']}).toArray(function(err, result){
				if(err || result.length == 0){
                                	res = {
                                	'status':'0',
                                	'message':'user need to be regisetered to wipe data'
                                	}
                                	serverCallback(res, 400);
                                	return;
				}
				userColl.drop(function(err, result){
					if(err || !result){
                                		res = {
                                		'status':'0',
                        		        'message':'could not able to wipe data'
                	        	        }
        	                	        serverCallback(res, 400);
	                        	        return;
					}
                               		res = {
                             		'status':'0',
                              		'message':'All data wiped successfully!'
                                	}
                                	serverCallback(res, 200);
				});

			});
		};
var createUserCallback = function(serverCallback, dbObject, userObject){
			var userColl = dbObject.collection('users');

			userColl.find({'username':userObject['username']}).toArray(function(err, result){
			if(result.length >0){
				res = {
				'status':'0',
				'message':'user already exists, please give a different username.'
				}
				serverCallback(res, 400);
				return;
			}
			userColl.insert(userObject, function(err, docs){
				if(err){
					res = {
					'status':'0',
					'message':'could not process request'
					}
					serverResponse(res, 400);
					return;
				}
				console.log("created user "+docs);
				res = {
				'status':'1',
				'message':'user created successfully!'
				}
				serverCallback(res, 200);
			});
		});
		};
var getAllUsersCallback = function(serverCallback, dbObject, userObject){
			var userColl = dbObject.collection('users');



                        userColl.find({'username':userObject['username']}).toArray(function(err, result){
                                if(err){
                                        res = {
                                        'status':'0',
                                        'message':'could not process request'
                                        }
                                        serverCallback(res, 400);
                                        return;
                                }
                                if(result.length == 0){
                                        res = {
                                        'status':'0',
                                        'message':'you need to be registered to get details'
                                        }
                                        serverCallback(res, 400);
                                        return;
                                }

                        userColl.find().toArray(function(err, result){
                                if(err){
                                        res = {
                                        'status':'0',
                                        'message':'could not process request'
                                        }
                                        serverCallback(res, 400);
                                        return;
                                }
                                if(result.length == 0){
                                        res = {
                                        'status':'0',
                                        'message':'no users found!'
                                        }
                                        serverCallback(res, 400);
                                        return;
                                }


                                res = {
                                'status':'1',
                                'message':'success',
                                'users':result
                                }
                                serverCallback(res, 200);
                        });

                        });

		};
var loginUserCallback = function(serverCallback, dbObject, userObject){
			var userColl = dbObject.collection('users');
			userColl.find({'username':userObject['username']}).toArray(function(err, result){
				 if(err){
					console.log("error in login "+err);
                                       res = {
                                        'status':'0',
                                        'message':'could not process request'
                                        }
                                        serverCallback(res, 400);
                                        return;
                                }
				if(result.length == 0){
					console.log("user not found in"+result);	
                                       res = {
                                        'status':'0',
                                        'message':'user does not exist'
                                        }
                                        serverCallback(res, 400);
                                        return;
				}
				var user = result[0];				
                                res = {
                                'status':'1',
                                'message':'login successfull',
                                'user':user
                                }
                                serverCallback(res, 200);

			});
		};

exports.createUserIfNotExists = function(serverCallback, dbObject, userObject){
			if(!userObject){
				res = {
				'status':'0',
				'message':'user definition not found'
				}
				//check retrofit support for having this error parsed if response is 400
				serverCallback(res, 400);
				return;
			}
			if(!userObject.hasOwnProperty(keyUserName) || !userObject.hasOwnProperty(keyFirstName)){
				res = {
				'status':'0',
				'message':'username and firstname both are required'
				}
				serverCallback(res, 400);
				return;
			}

			createUserCallback(serverCallback, dbObject, userObject);
		};


exports.getAllUsers = function(serverCallback, dbObject, userObject){
			if(!userObject){
                                res = {
                                'status':'0',
                                'message':'user definition not found'
                                }
                                //check retrofit support for having this error parsed if response is 400
                                serverCallback(res, 400);
                                return;
                        }
                        if(!userObject.hasOwnProperty(keyUserName)){
                                res = {
                                'status':'0',
                                'message':'username required!'
                                }
                                serverCallback(res, 400);
                                return;
                        }
			getAllUsersCallback(serverCallback, dbObject, userObject);
		};
exports.loginUser = function(serverCallback, dbObject, userObject){
                        if(!userObject){
                                res = {
                                'status':'0',
                                'message':'user definition not found'
                                }
                                //check retrofit support for having this error parsed if response is 400
                                serverCallback(res, 400);
                                return;
                        }
                        if(!userObject.hasOwnProperty(keyUserName)){
                                res = {
                                'status':'0',
                                'message':'username required!'
                                }
                                serverCallback(res, 400);
                                return;
                        }
                        loginUserCallback(serverCallback, dbObject, userObject);
                };
exports.wipeAllUserData = function(serverCallback, dbObject, userObject){
                        if(!userObject){
                                res = {
                                'status':'0',
                                'message':'user definition not found'
                                }
                                //check retrofit support for having this error parsed if response is 400
                                serverCallback(res, 400);
                                return;
                        }
                        if(!userObject.hasOwnProperty(keyUserName)){
                                res = {
                                'status':'0',
                                'message':'username required!'
                                }
                                serverCallback(res, 400);
                                return;
                        }
                        wipeAllData(serverCallback, dbObject, userObject);
                };
