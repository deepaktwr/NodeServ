var events = require("events");
var eventEmitter = new events.EventEmitter();
var handleEvent = function handleConn(){
	console.log("eventing connection\n emitting connected");
	eventEmitter.emit("connected");
}

eventEmitter.on("connection", handleEvent);

eventEmitter.on("connected", function(){
	console.log("called connected!");
});

eventEmitter.emit("connection");
