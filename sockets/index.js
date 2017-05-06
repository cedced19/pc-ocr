var getObject = function(array, roomId, cb) {
  for(var i in array) {
    if (array[i].id == roomId) {
      return cb(i);
    }
  }
  cb(false);
}


module.exports = function (io) {
  var rooms = [];
  return function (socket) {
    var user = {};
    socket.on('login', function (data) {
      user.roomId = data.id;
      user.type = data.type;
      socket.join(user.roomId);
      getObject(rooms, user.roomId, function (result) {
        if (result === false) {
          var room = {id: user.roomId};
          if (user.type == 'computer') {
            room.computer = socket.id;
          } else {
            room.phone = socket.id;
          }
          rooms.push(room);
        } else {
          if (user.type == 'computer') {
            rooms[result].computer = socket.id;
          } else {
            rooms[result].phone = socket.id;
          }
        }
      });
    });
  }
}
