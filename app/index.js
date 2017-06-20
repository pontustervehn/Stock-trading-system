var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require('express-session');
var sharedsession = require('express-socket.io-session');

var passwords = require('./passwords.js');
/*
"use strict";
exports.getSecret = function(){
  return "***********";
};*/


var port = 8080;

var app = express();
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
var session = expressSession({
    secret: passwords.getSecret(),
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);
io.use(sharedsession(session));

var router = require('./controller.js');
app.use('/API', router);

var socketController = require('./socketController.js');
io.on('connection', function (socket) {
  socketController(socket, io);
});

var securitymodel = require('./security.js');
var order = require('./order.js');
var trade = require('./trade.js');

httpServer.listen(port, function () {
  console.log("server listening on port", port);
});
