const socketClient = require('socket.io-client');
const socketio = require('socket.io');

const { map, keys } = require('lodash');

const sockOpt = {
  reconnection: false
};

describe('socket tests', () => {

  let client1, client2, address;
  let io;

  beforeEach( async (done) => {


    // find a free port
    var port = await require('detect-port')(5000);
    address = ['http://0.0.0.0', port].join(':');

    // establish socket server
    io = socketio(port);
    io.on('connection', require('../../app/socket')(io));

    // connect clients
    client1 = socketClient(address, sockOpt);
    client2 = socketClient(address, sockOpt);

    // wait for connection
    client1.once('connect', () => client2.once('connect', done));
  });


  afterEach((done) => {
    jest.resetModules()
    io.close(done);
  });

  it('should have 2 connected sockets', () => {

    // then
    expect(keys(io.sockets.connected)).toHaveLength(2);

  });


});
