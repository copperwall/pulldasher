import io from 'socket.io-client'

var socket = io.connect('/');
var authenticationSent = false;

socket.on('unauthenticated', function() {
   if (!App.airplane) {
      window.location.reload();
   }
});

socket.on('connect', function() {
   if (authenticationSent) {
      return;
   }
   var token = App.socketToken;
   socket.emit('authenticate', token);
   authenticationSent = true;
});


export default socket;
