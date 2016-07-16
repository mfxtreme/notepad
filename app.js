var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendFile(__dirname +'/index.html');
});

io.on('connection', function (socket) {
	socket.on('join_room',function(room){
		socket.join(room);
		socket.in(room).emit('joined_room', 'true');
	});

    socket.on('blob', function (room) {
		socket.in(room.name).emit('some_typing', {cur_loc:room.cursor_location});
    });
	socket.on('disconnect', function(){
		if (io.sockets.connected[socket.id]) {
			io.sockets.connected[socket.id].disconnect();
		}
	});
});
