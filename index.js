var io = require('socket.io')(3000);
var stdin = process.openStdin();

process.stdout.write("play/pause/skip/<track uri>: ");

stdin.addListener("data", function(d) {
    var command = d.toString().trim();
    
    switch(command) {
        case 'play':
            io.emit('play');
            break;
        case 'pause':
            io.emit('pause');
            break;
        case 'skip':
            io.emit('skip');
            break;
        default:
            io.emit('add track to queue', command);
    }
    process.stdout.write("play/pause/skip/<track uri>: ");
});

io.on('connection', function(socket) {
});
