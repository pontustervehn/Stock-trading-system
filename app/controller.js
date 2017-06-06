/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");
//:::::::::::::::::::::::::::::::::::::::::::::::::::::
var securitymodel = require("./securitymodel.js");
var order = require("./order.js");
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
  res.json({list: messages});
});

//lols

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
  res.json({list: messages});
});

router.post('/addSecurity', function (req, res) {
  securitymodel.addSecurity();
  //res.json({name:"Anon"});
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

router.get('/orderlist', function (req, res) {
  var orders = order.getOrders();
  var orderIds = [];
  for (var i = 0; i < orders.length; i++) {
    orderIds.push(orders[i]);
  }
  res.json({list:orderIds});
});


router.get('/order/:order', function (req, res) {
  var messages = order.findOrder(req.params.order).messages;
  res.json({list: messages});
});

router.post('/addOrder', function (req, res) {
  order.addOrder();
});


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

router.post('/setUser', function (req, res) {
  res.json({name:"Anon"});
});

module.exports = router;
