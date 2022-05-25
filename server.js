/************************************
    create a node server
************************************/

//require a node package - http package
const http = require('http')
//run express app on the node server
const app = require('./app')


//The  normalizePort  function returns a valid port, 
//whether it is provided as a number or a string
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//set port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


//The  errorHandler  function checks for various errors and handles them appropriately 
//— it is then registered to the server.
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//create a server 
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//set the server up to listen
server.listen(port);