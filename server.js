'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', function (socket) {
	socket.on('join_room',function(room){
		socket.join(room);
	});
	
	socket.on('editing', function (room) {
		var count = io.sockets.adapter.rooms[room.name];
		if (count.length > 1) {
			socket.in(room.name).emit('update', {text:room.text,cursor_location:room.cursor_location});
		}
	});
	socket.on('disconnect', function(){
		if (io.sockets.connected[socket.id]) {
			io.sockets.connected[socket.id].disconnect();
		}
	});
});
