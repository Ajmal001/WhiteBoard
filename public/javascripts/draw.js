// Connect to the nodeJs Server
io = io.connect('/');

var path;

// to define new path
function onMouseDown(event) {  
  path = createNewPath(event.point.x, event.point.y);
  emitNewPath(event.point.x, event.point.y);
}
function createNewPath(x, y) {
  return new Path({
    segments: [new Point(x, y)],
    strokeColor: 'black',
  });
}
// emit the new path point
function emitNewPath(x, y) {
  var sessionId = io.id;
  var data = {
    x: x,
    y: y,
    // todo : add color
  };
  io.emit('createNewPath', data, sessionId )
}
// Listen for 'createNewPath' events
io.on( 'createNewPath', function( data ) {
  path = createNewPath(data.x, data.y);
});

// to draw the line
function onMouseDrag(event) {
  path.add(event.point);
  emitPoint(event.point.x, event.point.y);
}
function emitPoint(x, y) {
  var sessionId = io.id;
  var data = {
    x: x,
    y: y,
    // color
  };
  io.emit( 'pointDrag', data, sessionId )
}
io.on( 'pointDrag', function( data ) {
  path.add(new Point(data.x, data.y));
});


