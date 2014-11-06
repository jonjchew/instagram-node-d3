var instagram = require('./instagram')

var socket = {

  initialize: function(io) {
    var self = this;
    io.on('connection', function(socket){
      console.log("User connected!");

      socket.on('subscribe', function(room) { 
          self.leaveRoom(io, self.roomName, 1);
          console.log('Joining room', room);
          socket.join(room);
          self.roomName = room;
      });

      socket.on('disconnect', function(){
        console.log('User disconnected!');
        self.leaveRoom(io, self.roomName);
      });

    });
  },

  leaveRoom: function(io, roomName, length) {
    var self = this;
    length = length || 0;

    var room = io.nsps['/'].adapter.rooms[self.roomName];
    if (room != null) {
      if (Object.keys(room).length === length) {
        instagram.unsubscribeByHashTag(self.roomName);
      }
    }
  },

  findClients: function(io, roomId, namespace) {
    var clients = []
    , ns = io.of(namespace ||"/");

    if (ns) {
      for (var id in ns.connected) {
        if(roomId) {
          var index = ns.connected[id].rooms.indexOf(roomId) ;
          if(index !== -1) {
            clients.push({id: ns.connected[id].id});
          }
         } else {
          clients.push({id: ns.connected[id].id});
        }
      }
    }
    return clients;
  }

}


module.exports = socket;
