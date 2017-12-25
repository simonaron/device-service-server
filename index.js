var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bonjour = require('bonjour')()

var devices = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  var mac;
  socket.on('client-info', (info) => {
    mac = info.mac;
    devices[info.mac] = info;
    devices[mac].status = "available";
    console.log(devices);
    //socket.emit('device-registrate-response', devices.length);
  });

  socket.on('disconnect',() => {
    console.log('a user disconnected');
    devices[mac].status = "unavailable";
    console.log(devices);
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
  bonjour.publish({
    name: 'device-service-server',
    type: 'http',
    port: 3000
  });
});
