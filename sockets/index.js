var getObject = function(array, roomId, cb) {
  for(var i in array) {
    if (array[i].id == roomId) {
      return cb(i);
    }
  }
  cb(false);
};

var getOtherId = function (object, type, cb) {
  if (type == 'computer' && object.hasOwnProperty('phone')) {
    cb(object.phone);
  }
  if (type == 'phone' && object.hasOwnProperty('computer')) {
    cb(object.computer);
  }
};

module.exports = function (io) {
  var rooms = [];

  var sendMessageToOther = function (user, messageName, messageContent) {
    getObject(rooms, user.roomId, (result) => {
      if (result === false) return false;
      getOtherId(rooms[result], user.type, (id) => {
        if (!messageContent) messageContent = {};
        io.sockets.connected[id].emit(messageName, messageContent)
      });
    });
  };

  return function (socket) {
    var user = {};
    socket.on('login', function (data) {
      user.roomId = data.id;
      user.type = data.type;
      socket.join(user.roomId);
      // Save socket session in a couple pc/phone
      getObject(rooms, user.roomId, function (result) {
        if (result === false) {
          result = rooms.push({id: user.roomId}) - 1;
        }
        if (user.type == 'computer') {
          rooms[result].computer = socket.id;
        } else {
          rooms[result].phone = socket.id;
        }
        getOtherId(rooms[result], user.type, function (id) {
          io.sockets.connected[id].emit('connected');
        });
      });
    });

    socket.on('image-uploaded', function (data) {
      sendMessageToOther(user, 'image-uploaded');
    });

  }
};
