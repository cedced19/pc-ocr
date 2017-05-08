var fs = require('fs');
var tika = require('tika');
var path = require('path');
var existsFile = require('exists-file');

var getOtherId = function (object, type, cb) {
  if (type == 'computer' && object.hasOwnProperty('phone')) {
    cb(object.phone);
  }
  if (type == 'phone' && object.hasOwnProperty('computer')) {
    cb(object.computer);
  }
};

var deleteFile = function(p) {
 existsFile(p, function (err, exist) {
   if (exist) {
     fs.unlink(p);
   }
 });
};

module.exports = function (io) {
  var rooms = [];

  var getRoom = function(roomId, cb) {
    for(var i in rooms) {
      if (rooms[i].id == roomId) {
        return cb(i);
      }
    }
    cb(false);
  };

  var sendMessageToOther = function (user, messageName, messageContent) {
    getRoom(user.roomId, (result) => {
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
      getRoom(user.roomId, function (result) {
        if (result === false) {
          result = rooms.push({id: user.roomId}) - 1;
        }
        if (user.type == 'computer') {
          rooms[result].computer = socket.id;
        } else {
          rooms[result].phone = socket.id;
        }
        socket.emit('room', rooms[result]);
        getOtherId(rooms[result], user.type, function (id) {
          io.sockets.connected[id].emit('connected');
        });
      });
    });

    socket.on('image-uploaded', function (data) {
      sendMessageToOther(user, 'image-uploaded');
    });

    socket.on('cropped-image-uploaded', function (data) {
      sendMessageToOther(user, 'cropped-image-uploaded');
      var p = path.join(__dirname, '../uploads/cropped', user.roomId);
      tika.type(p, function(err, result) {
        if (err) return socket.emit('error-parsing-text', err);
        tika.text(p, {contentType: result, ocrLanguage: (data.lang || 'eng')}, function(err, text) {
        	if (err) return socket.emit('error-parsing-text', err);
          socket.emit('text-converted', {text: text});
        });
      });
    });

    socket.on('disconnect', function () {
      io.emit('user-disconnected', user.roomId);
      getRoom(user.roomId, (result) => {
        if (result === false) return false;
        if (user.type == 'computer') {
          delete rooms[result].computer;
        } else {
          delete rooms[result].phone;
        }
        if (!rooms[result].hasOwnProperty('phone') && !rooms[result].hasOwnProperty('phone')) {
          deleteFile(path.join(__dirname, '../uploads/raw', user.roomId));
          deleteFile(path.join(__dirname, '../uploads/cropped', user.roomId));
          rooms.splice(result, 1);
        }
      });
    });

  }
};
