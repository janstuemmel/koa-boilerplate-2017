var appname = require('./package.json').name;

var conf = require('rc')(appname, {
  port: 1337,
  address: '0.0.0.0',
});

var server = require('./app').server;

console.log('Starting', appname, '...');

server.listen(conf.port, conf.address, () => {
  console.log('Server listening on', [
    server.address().address,
    server.address().port
  ].join(':'));
});
