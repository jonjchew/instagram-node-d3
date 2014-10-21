var socket = {

  initialize: function(io, callback) {
    var self = this;
    io.on('connection', function(socket){
      console.log("User connected!");

      socket.on('subscribe', function(room) { 
          console.log('Joining room', room);
          socket.join(room);
          self.roomName = room;
      });

      socket.on('disconnect', function(){
        console.log('User disconnected!');
        // Unsubscribe from hash tag subscription if nobody else is subscribed
        var room = io.nsps['/'].adapter.rooms[self.roomName];
        if (room != null) {
          if (Object.keys(room).length === 0) {
            callback(self.roomName);
          }
        }
      });

    });
  }

}


module.exports = socket;
