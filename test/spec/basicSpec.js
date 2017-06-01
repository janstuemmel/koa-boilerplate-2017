const socketClient = require('socket.io-client');
const app = require('../../app');

const fetch = require('node-fetch');

describe('basic tests', () => {

  let server, path, client;

  beforeAll(async () => {

    // detect a free port
    const port = await require('detect-port')(5000);
    const address = [ 'http://0.0.0.0', port ].join(':');
    path = (p) => [ address, p ].join('');

    // listen to server
    server = app.listen(port);

    // connect socketio clients
    client = socketClient.connect(address);
  });


  afterAll(() => {
    // close server, release port
    server.close();
  });


  it('should get /', async () => {

    // given
    var res = await fetch(path('/'));

    // when
    var text = await res.text();

    // then
    expect(res.status).toBe(200);
    expect(text).toEqual(expect.any(String));
  });


  it('should emit socket.io event on /', async (done) => {

    // given
    const spy = jest.fn(done);
    client.on('route_root', spy);

    // when
    await fetch(path('/'));

    // then
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.instances[0]).toBe(client);
  });

});
