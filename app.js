var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config')
var uuid = require('uuid-v4');

var routes = require('./routes/index');
var users = require('./routes/users');
var ig = require('./routes/ig');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session')
// var RedisStore = require('connect-redis')(session);

var MemoryStore = session.MemoryStore;
// app.use(session({
//   genid: function(req) {
//     return uuid(); // use UUIDs for session IDs
//   },
//   store: new RedisStore({
//       host:'127.0.0.1',
//       port:6379
//   }),
//   secret: 'keyboard cat'
// }));
app.use(session({
  genid: function(req) {
    return uuid(); // use UUIDs for session IDs
  },
  store: MemoryStore(),
  secret: 'keyboard cat'
}));



var Instagram = require('instagram-node-lib');
Instagram.set('client_id', config.instagram.client_id);
Instagram.set('client_secret', config.instagram.client_secret);
Instagram.set('callback_url', config.root_url + '/callback');
Instagram.set('redirect_uri', config.root_url);
Instagram.set('maxSockets', 10);

// Instagram.subscriptions.subscribe({
//   object: 'tag',
//   object_id: 'sanfrancisco',
//   aspect: 'media',
//   callback_url: config.root_url + '/ig/callback',
//   type: 'subscription',
//   id: '#'
// });
Instagram.subscriptions.unsubscribe_all();

// io.sockets.on('connection', function (socket) {
//   Instagram.tags.recent({
//       name: 'nofilter',
//       complete: function(data) {
//         socket.emit('firstShow', { firstShow: data });
//       }
//   });
// });
app.set('io', io);
app.set('server', server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ig', ig);

// function sendMessage(url) {
//   io.sockets.emit('show', { show: url });
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
