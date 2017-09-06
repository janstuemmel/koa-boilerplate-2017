const Koa = require('koa');
const route = require('koa-route');
const serve = require('koa-static');

const http = require('http');
const socketio = require('socket.io');

const app = new Koa();

app.server = http.Server(app.callback());
app.io = socketio(app.server);

app.use(serve('public'));

app.use(route.get('/api', ctx => {
  ctx.app.io.emit('route', 'api');
  ctx.body = 'Hello World';
}));

app.io.on('connection', require('./socket')(app.io));

module.exports = app;
