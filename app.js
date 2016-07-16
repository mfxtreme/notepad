var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

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
