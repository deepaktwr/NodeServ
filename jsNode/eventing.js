var myEvent = require("events");
var eventEmitter = new myEvent.EventEmitter();
var handler1 = function handleConnection(){
	console.log("hadlening event in hndler for connection.");	
	eventEmitter.emit("connected");
}
eventEmitter.on("make connection", handler1);

eventEmitter.on("connected", function(){
	console.log("data received afer connection");
});

eventEmitter.emit("make connection");
console.log("ended");
