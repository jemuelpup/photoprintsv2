
var express = require('express'),
	socket = require('socket.io'),
	http = require('http'),
	path = require('path'),
	logger = require('winston');
// var http = require('http').Server(app);

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize:true,timestamp:true});
logger.info('SocketIO > listening on port ')


// var server = app.listen(3000,function(){
// 	console.log("listening on port 3000");
// });

var app = express();
var http_server = http.createServer(app).listen(3000);
app.use(express.static('public'))

function emitNewOrder(http_server){
	var io = socket.listen(http_server);
	// listen to a connection and run the callback function
	io.sockets.on('connection',function(socket){
		socket.on('new_order',function(data){
			
		})
	});
}

emitNewOrder(http_server);

//static files





//socket setup
/*

var io = socket(server);


// listen for connection
// socket is the instance of the socket
io.on('connection',function(socket){
	console.log("made socket connection");


	// this is the receive code
	socket.on('msg',function(data){
		//this is the broadcast message
		io.sockets.emit('msg',data);
		// console.log(data);
	});
});

*/