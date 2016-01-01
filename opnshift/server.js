#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var users = require('./FetchUsers.js');
var uploadImage = require("./UploadImage.js");
var bodyParser = require('body-parser');
var multer = require("multer");
var path = require('path');
var festivals = require('./FetchFestivals.js');
var usersCollection = require('./api/UsersCollection');
var mongoClient = require('mongodb').MongoClient;


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;

    var dbObject;

    var urlEncodedParser = bodyParser.urlencoded({extended:true})
    var jsonParser = bodyParser.json();




    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };

	self.connectionString = '127.0.0.1:27017/services';
	if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
		self.connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME;

	mongoClient.connect('mongodb://'+self.connectionString, function(err, db){
		if(err)throw err;
		dbObject = db;
	});
	}

    };

    self.response = 'undefined';
    self.callback = function(data, respStatus){
	if(typeof self.response === 'undefined')
		console.log("response object undefined");
         self.response.status(respStatus).send(data);
    }


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
	self.zcache['FileUpload.htm'] = fs.readFileSync('./FileUpload.htm');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.get_routes = { };
	self.post_routes = { };
	self.file_routes = { };

        self.get_routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.get_routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
	self.get_routes['/get_users'] = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		response = res;
		users.getAllUsers(fs, callback);
		
	};
	self.get_routes['/get_all_fests'] = function(req, res){
		res.setHeader('Content-Type', 'application/json');
		self.response = res;
		festivals.getAllFestivals(fs, self.callback, dbObject);
	};
	self.get_routes['/image_upload'] = function(req, res){
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('FileUpload.htm'));
	};
	self.post_routes['/get_user'] = function(req, res) {
		res.setHeader('Content-Type', 'application/json');
                var data = req.body;
                if(data.hasOwnProperty('user_name')){
			self.response = res;
                        users.getUserDetails(fs, data['user_name'], self.callback);
                }else{
                        rspns={
                        'status':'0',
                        'error':'invalide json key'
                        }
                        res.status(400).send(rspns);
                }
	};

        self.post_routes['/getAllUsers'] = function(req, res) {
                res.setHeader('Content-Type', 'application/json');
		self.response = res;
                var data = req.body;
                usersCollection.getAllUsers(self.callback, dbObject, data);
        };
        self.post_routes['/loginUser'] = function(req, res) {
                res.setHeader('Content-Type', 'application/json');
		self.response = res;
                var data = req.body;
                usersCollection.loginUser(self.callback, dbObject, data);
        };
        self.post_routes['/createUser'] = function(req, res) {
                res.setHeader('Content-Type', 'application/json');
		self.response = res;
                var data = req.body;
                usersCollection.createUserIfNotExists(self.callback, dbObject, data);
        };
        self.post_routes['/wipeAllUsers'] = function(req, res) {
                res.setHeader('Content-Type', 'application/json');
		self.response = res;
                var data = req.body;
                usersCollection.wipeAllUserData(self.callback, dbObject, data);
        };

	self.file_routes['/upload_image'] = function(req, res) {
		self.response = res;
		var fileName = req.body.imagename;
		console.log("file "+fileName);
		if(!fileName){	
			res.status(400).send("please give a name of file");
			return;
		}
		var extention = path.extname(fileName);
		console.log("ext"+ extention);
		if(!extention || extention != '.png'){
			console.log("ext "+extention +" is not png");
			res.status(400).send("only png file are supported.");
			return;
		}
		
		console.log("file data "+ req.file + " name "+req.file.fieldname+" path "+req.file.path);
		uploadImage.uploadFile(fileName, req.file.path, self.callback, fs);
	};
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */

    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();
	self.app.use(urlEncodedParser);
	self.app.use(jsonParser);
	self.app.use(express.static("public"));
	var upload = multer({dest:'./public/uploads/'});
	self.app.use(upload);

        //  Add handlers for the app (from the routes).
        for (var r in self.get_routes) {
            self.app.get(r, self.get_routes[r]);
        }
	for (var p in self.post_routes) {
	    self.app.post(p, self.post_routes[p]);
	}for (var i in self.file_routes) {
            self.app.post(i, upload.single("imgFile"), self.file_routes[i]);
        }
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

