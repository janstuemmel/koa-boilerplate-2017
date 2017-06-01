const Koa = require('koa');
const route = require('koa-route');

const http = require('http');
const socketio = require('socket.io');

const app = new Koa();

var server = http.Server(app.callback());
var io = socketio(server);

app.use(function (ctx, next) {
  ctx.io = io;
  next()
});

app.use(route.get('/', ctx => {
  ctx.io.emit('route_root');
  ctx.body = 'Hello World';
}));

io.on('connection', require('./socket'));

module.exports = server;
