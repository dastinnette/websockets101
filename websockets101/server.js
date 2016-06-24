const http = require('http');
const express = require('express');

const app = express();

var votes = {}

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(_dirname + 'public/index.html');
});

var port = process.env.PORT || 3000;
var server = http.createServer(app)
                 .listen(port, function(){
                   console.log('Listening on port' + port +'.');
                 });
var votes = {};

const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function(socket){
  io.sockets.emit('voteCount', countVotes(votes));
  io.sockets.emit('usersConnected', io.engine.clientsCount);
  socket.emit('statusMessage', 'You have connected');

  socket.on('disconnect', function(){
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes))
    io.sockets.emit('usersConnected', io.engine.clientsCount)
  });

  socket.on('message', function(channel, message){
    if(channel === 'voteCast'){
      votes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes));
    }
  })

  io.sockets.emit('voteCount', countVotes(votes));
});

function countVotes(votes){
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for(var vote in votes){
    voteCount[votes[vote]]++
  }
  return voteCount;
}




module.exports = server;
