const socketClient = require('socket.io-client');
const createTestServer = require('testtp');

const { map, keys } = require('lodash');

const app = require('../../app');

const SOCK_OPT = {
  reconnection: false
};

describe('socket tests', () => {

  let client1, client2, test;

  beforeEach( async () => {

    test = await createTestServer(app.server);

    // connect clients
    client1 = socketClient(test.url, SOCK_OPT);
    client2 = socketClient(test.url, SOCK_OPT);
  });

  afterEach(() => {
    client2.close();
    client1.close();
  });


  it('should have 2 connected sockets', (done) => {

    client1.once('connect', () => {

      client2.once('connect', () => {

        // then
        expect(keys(app.io.sockets.connected)).toHaveLength(2);
        done();
      });
    });

  });


  it('should join a room', (done) => {

    // given
    client1.once('joined_room', () => {

      // then
      done()
    });

    // when
    client1.emit('join_room', 'testRoom');
  });


  it('should receive a message', (done) => {

    // given
    client1.once('message', data => {

      // then
      expect(data.msg).toBe('testMsg');
      done();
    });

    // when
    client1.emit('join_room', 'testRoom');
    client2.emit('join_room', 'testRoom');
    client2.emit('message', 'testMsg');
  });

});
