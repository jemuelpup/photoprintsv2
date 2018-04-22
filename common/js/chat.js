var socket = io.connect('http://10.16.19.131:3000');

// Emit events

var message = "";

// this is the sender of the message from the client to server.... client -> server
senMessage();
function senMessage(){
	// this is the send code
	socket.emit('msg',{
		message: "test message",
		handle: "this is the handle"
	});// send something from client to the server
}


// listen for events
// this is the listener for the message from the server. server -> client
socket.on('msg',function(data){
	console.log(data);
});