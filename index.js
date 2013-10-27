var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.takeoff();

app.listen(8000);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html', afterReadFile);
  function afterReadFile(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  }
}

io.sockets.on('connection', function (socket) {
	console.log('Client connected');
	var client  = arDrone.createClient();

  socket.on('msg', function (data) {
		console.log(data);
    data.cmds.forEach(function (cmd) {
      console.log(cmd[0], cmd[1]);
      client[cmd[0]].apply(client, [cmd[1]]);
    });
  });
});

