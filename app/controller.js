/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();

var securitymodel = require("./security.js");
var order = require("./order.js");
var trade = require('./trade.js');

router.get('/securitylist', function (req, res) {
  var securities = securitymodel.getSecurities();
  var securityNames = [];
  for (var i = 0; i < securities.length; i++) {
    securityNames.push(securities[i]);
  }
  res.json({list:securityNames});
});

router.get('/security/:security', function (req, res) {
  var names = securitymodel.findSecurity(req.params.security).names;
  res.json({list:names});
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

router.post('/setUser', function (req, res) {
  res.json({name:"Anon"});
});

module.exports = router;
