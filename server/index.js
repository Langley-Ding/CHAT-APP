const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');
// const { use } = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('we have a new connection!!')
    socket.on('join', ({name, room}, callback) => {
        console.log(name,room)//刷新页面，会在终端（服务端）打印出名字和房间
        const { error, user } = addUser({id: socket.id, name, room});//addUser会返回2个可能，error对象或User对象；
        
        if (error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`});
        socket.join(user.room);

        io.to(user.room).emit('roomData',{room: user.room, users: getUsersInRoom(user.room)})

        callback();
    });
//emit listener is here! it listens "sendMessage" here! and then it send to the whole server or the room
//
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
    
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
      });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user){
            io.to(user.room).emit('message', { user:'admin', text: `${user.name} has left.`})
        }
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));