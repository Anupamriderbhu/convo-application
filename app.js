const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);   //creating http server
const { Server } = require('socket.io');
const io = new Server(server);    //it is creating socket
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, ''))); // it is serving full folder

app.get("/", (req, res)=> {
    res.sendFile(index);  //index.html
});

// socket.io server is an instance of http server.it is listening to incoming events 
var users ={};

io.on('connection', (socket) => {      // it runs when connection is made.it is an socket.io instance which is listening to socket connections.
    socket.on('new-user-joined',name =>{
        users[socket.id]=name;   // appending to array
        socket.broadcast.emit('user-joined',name);  // broadcast emit shares info to all except us
    });

    socket.on('send',message =>{  
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]});
    });

    socket.on('disconnect', message =>{    // this event is pre-defined it runs when connection demonishes
        socket.broadcast.emit('left', users [socket.id]);
        delete users [socket.id];   // delete the user
    });
});

server.listen(port, ()=>{
    console.log('Server connected');
});