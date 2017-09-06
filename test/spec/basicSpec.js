const socketClient = require('socket.io-client');
const createTestServer = require('testtp');

const { keys } = require('lodash');

const app = require('../../app');

const SOCK_OPT = {
  reconnection: false
};

describe('basic tests', () => {

  var test, client;

  beforeEach( async (done) => {

    test = await createTestServer(app.server);

    // connect a socket io client
    client = socketClient.connect(test.url, SOCK_OPT);

    // wait for client connection
    client.once('connect', done);
  });


  afterEach(done => {
    client.once('disconnect', () => test.close(done));
    client.close();
  });


  it('should get /', async () => {

    // given
    var res = await test.get('/api');

    // when
    var text = await res.text();

    // then
    expect(res.status).toBe(200);
    expect(text).toEqual(expect.any(String));
  });


  it('should emit socket.io event on /', async (done) => {

    // given
    client.on('route', data => {

      // then
      expect(data).toEqual('api');
      done();
    });

    // when
    var res = await test.get('/api');
  });

});
