var usersCallback = function(err, data, serverCallback){
		if(err){
			console.log("error reading file : "+err);
			var users = {
				'status':'0',
				'error':'no user exixts'
			};
			serverCallback(users, 400);
			return;
		}
		var users = JSON.parse(data);

		var userList=JSON.parse('[]');
		for(var key in users){
			console.log("parsing "+key);
			var iUser = users[key];
			for(var iKey in iUser){
				console.log("\tat "+iKey+" val = "+iUser[iKey]);
				
			}
			userList.push(iUser);
		}
		resp = {
		'status':'1',
		'users':userList
		}
		serverCallback(resp, 200);
	}
var userCallback = function(err, data, usern, serverCallback){
	if(err){
		console.log("error reading file"+err);
		var users = {
			'status':'0',
			'error':'no user exists'
			}
		serverCallback(users, 400);
		return;
	}
	var users = JSON.parse(data);
	var resp = {
		'status':'0',
		'error':'user does not exist'
	}
	var respStatus = 400;
		if(users.hasOwnProperty(usern)){
			resp = {
				'status':'1',
				'user':users[usern]
			}
		respStatus = 200;
		}else console.log("user not exists"+usern);
	serverCallback(resp, respStatus);


}
exports.getAllUsers = function(fs, serverCallback){
		fs.readFile("users.json", "utf8", function(err, data){
			usersCallback(err, data, serverCallback);
		});	
	}
exports.getUserDetails = function(fs, userName, serverCallback){
		fs.readFile("users.json", "utf8", function(err, data){
			userCallback(err, data, userName, serverCallback);
		});
	}
