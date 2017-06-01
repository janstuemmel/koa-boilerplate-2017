const { remove } = require('lodash');

module.exports = (io) => (socket) => {

  socket.emit('connected');
}
