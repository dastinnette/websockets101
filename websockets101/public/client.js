var socket = io()
var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var buttons = document.querySelectorAll('#choices button');
var sendVote = document.getElementById('vote-count');

socket.on('usersConnected', function(count){
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function(message){
  statusMessage.innerText = message;
});

socket.on('voteCount', function(votes){
  var keys = Object.keys(votes);
  for (i in keys){
    var sendVote = document.getElementById(keys[i]);
    sendVote.innerText = votes[keys[i]]
  }
});

for(var i=0; i < buttons.length; i++){
  buttons[i].addEventListener('click', function(){
    socket.send('voteCast', this.innerText);
  });
}
