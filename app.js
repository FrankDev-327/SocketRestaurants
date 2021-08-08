'use strict';


const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const amq = require('amqplib/callback_api');
const { _CACHEDB_, _RABBIT_, PORT } = require('./setups/setting');

io.on('connection', function (socket) {
   amq.connect(_RABBIT_, function (err, conn) {
      conn.createChannel(function (err, channel) {
         channel.assertQueue('client', {
            durable: true
         });
         channel.consume(_CACHEDB_, function (data) {
            let auxSend = data.content.toString();
            //socket.broadcast.emit('order-view', auxSend);
            socket.emit('order-view', auxSend);
            channel.ack(data);
         });
      });
   });
});


http.listen(PORT, () => {
   console.log('Server running on port: ' + PORT);
})