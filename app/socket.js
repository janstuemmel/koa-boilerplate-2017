const { keys } = require('lodash');

class SocketInRoom {

  constructor(room, socket, io) {
    this.room = room;
    this.socket = socket;
    this.io = io;

    this.number = keys(io.sockets.connected).length + 1;
    this.name = [ 'Anonymous', this.number ].join(' ');

    this.socket.on('message', this._onMessage.bind(this));
    this.socket.join(room);
    this.socket.emit('joined_room');
  }

  _onMessage(msg) {
    this.socket.broadcast.to(this.room).emit('message', {
      from: this.name,
      msg: msg
    });
  }
}

module.exports = (io) => (socket) => {

  socket.on('join_room', room => new SocketInRoom(room, socket, io));
}
