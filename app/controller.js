/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");

router.get('/roomlist', function (req, res) {
  var rooms = model.getRooms();
  var roomNames = [];
  for (var i = 0; i < rooms.length; i++) {
    roomNames.push(rooms[i]);
  }
  res.json({list:roomNames});
});

router.get('/room/:room', function (req, res) {
  var messages = model.findRoom(req.params.room).messages;
  res.json({list: messages});
});

router.post('/setUser', function (req, res) {
  res.json({name:"Anon"});
});

module.exports = router;
