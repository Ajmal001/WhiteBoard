var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var paper = require('paper');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/paper/dist/')));

app.set('port', process.env.PORT || 3000);
var server = http.createServer(app).listen( app.get('port') );
var io = require('socket.io').listen(server, function() {
        console.log("Express server listening on port " + app.get('port'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// open a socket
io.sockets.on('connection', function (socket) {

    socket.on( 'createNewPath', function( data, session ) {
    	socket.broadcast.emit( 'createNewPath', data );
	})
	socket.on( 'pointDrag', function( data, session ) {
    	socket.broadcast.emit( 'pointDrag', data );
	})
});

module.exports = app;
