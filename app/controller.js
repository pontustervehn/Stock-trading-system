/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");
//:::::::::::::::::::::::::::::::::::::::::::::::::::::
var securitymodel = require("./securitymodel.js");
var order = require("./order.js");
var trade = require('./trade.js');
//:::::::::::::::::::::::::::::::::::::::::::::::::::::

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
  res.json({list:messages});
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
router.get('/securitylist', function (req, res) {
  var securities = securitymodel.getSecurities();
  var securityNames = [];
  for (var i = 0; i < securities.length; i++) {
    securityNames.push(securities[i]);
  }
  res.json({list:securityNames});
});

router.get('/security/:security', function (req, res) {
  var messages = securitymodel.findSecurity(req.params.security).messages;
  res.json({list:messages});
});


router.get('/orderlist/:secname', function (req, res) {
  var orders = order.getOrders();
  var orderIds = [];
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].security === req.params.secname){
      orderIds.push(orders[i]);
    }
  }
  res.json({list:orderIds});
});

router.get('/tradelist/:secname', function (req, res) {
  var trades = trade.getTrades();
  var tradeNames = [];
  for (var i = 0; i < trades.length; i++) {
    if (trades[i].security === req.params.secname){
      tradeNames.push(trades[i]);
    }
  }
  res.json({list:tradeNames});
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
router.post('/setUser', function (req, res) {
  res.json({name:"Anon"});
});

module.exports = router;
