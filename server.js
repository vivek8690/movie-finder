const http = require('http');
const app = require('./middlewares/app');

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            process.exit(1);
            break;
        case 'EADDRINUSE':
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `Pipe ${port}` : `Port ${port}`;
    console.log(`Listening on ${bind}`);
}

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
