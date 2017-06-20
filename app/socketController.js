/* jslint node: true */
"use strict";

var securitymodel = require('./security.js');
var order = require('./order.js');
var trade = require('./trade.js');

module.exports = function (socket, io) {

socket.on('joinseclist', function (req) {
  socket.join("seclist");
});

//Emits to socket channel that a security has been added
socket.on('addsec', function (req) {
  console.log("Added Security: " + req.security);
  var secname = req.security;
  io.to(secname).emit('addsec', req);
  securitymodel.addSecurity(secname);
  io.to("seclist").emit('addsec', req);
});

//On placeorder emit in browser, send get commands to models. Checks order matches and commits changes to objects
socket.on('placeorder', function (req) {
  if (req.username === ''){
    req.username = "Anonymous";
  } else {}
  console.log("\n" + req.username + " added " +req.type+ "-order: Amount: " + req.amount + " Price: " + req.price +  " Securityname: " + req.secname + "\n");
  var uname = req.username;
  var type = req.type
  var secname = req.secname;
  var amount= req.amount;
  var price = req.price;

  function orderCheck(amount) {
    var noOrderMatches = true

    if (order.getOrders().length <= 0){
      console.log("Array is empty. Adds first order.");
      order.addOrder(uname, type, secname, amount, price);
      io.to(secname).emit('updateorderlist', req);
      noOrderMatches = false;
    } else {

      var orders = order.getOrders();

      for (var i = 0; i < orders.length; i+=1) {
        var newAmount = 0;
        if ((orders[i].security===secname) && (orders[i].type!==type) && (orders[i].price === price)){
          if (orders[i].amount===amount){
            //Setting amount of existing order to 0
            order.updateOrder(order.getOrders()[i].orderId, 0);
            io.to(secname).emit('updateorderlist', req);
            noOrderMatches = false;

            console.log("\nAdding order to completed trades..\n");
            if (type === "buying"){
            trade.addTrade(secname,uname,orders[i].userName,amount, price);
            io.to(secname).emit('updateorderlist', req);
            } else {
            trade.addTrade(secname,orders[i].userName,uname,amount, price);
            io.to(secname).emit('updateorderlist', req);
            }

            break;

          } else if (orders[i].amount>amount) {
            newAmount = orders[i].amount - amount;
            console.log("Updating " + orders[i].type + "-order");
            order.updateOrder(order.getOrders()[i].orderId, newAmount);
            io.to(secname).emit('updateorderlist', req);
            noOrderMatches = false;

            console.log("\nAdding order to completed trades..\n");
            if (type === "buying"){
            trade.addTrade(secname,uname,orders[i].userName,amount, price);
            io.to(secname).emit('updateorderlist', req);
            } else {
            trade.addTrade(secname,orders[i].userName,uname,amount, price);
            io.to(secname).emit('updateorderlist', req);
            }

            break;

          } else if ((orders[i].amount<amount) && (orders[i].amount>0)) {
              var originalAmount = orders[i].amount;
              newAmount = amount - orders[i].amount;
              //Setting existing order amount to 0
              order.updateOrder(order.getOrders()[i].orderId, 0);
              io.to(secname).emit('updateorderlist', req);
              noOrderMatches = false;

              console.log("\nAdding order to completed trades..\n");
              if (type === "buying"){
                trade.addTrade(secname,uname,orders[i].userName,originalAmount, price);
               io.to(secname).emit('updateorderlist', req);
              } else {
                trade.addTrade(secname,orders[i].userName,uname,originalAmount, price);
                io.to(secname).emit('updateorderlist', req);
              }

              orderCheck(newAmount); //runs orderCheck function again but with an adjusted (lowered) amount
            } else {}
        } else {}
    }
  }

  //If no order matches are found, just add new order.
  if (noOrderMatches){
    order.addOrder(uname, type, secname, amount, price);
    io.to(secname).emit('updateorderlist', req);
  } else {}

  noOrderMatches = true;

  //Removes empty orders (amount=0) from orderList
  for (var i = 0; i < order.getOrders().length; i+=1) {
    if (order.getOrders()[i].amount===0){
      console.log("Removing zero-amount " + order.getOrders()[i].type + "-order");
      order.removeOrder(order.getOrders()[i].orderId);
      io.to(secname).emit('updateorderlist', req);
    } else {}
  }
  return
  }

  orderCheck(amount);
});

// user joins security
socket.on('secjoin', function (req) {
  console.log(req);
  var name = req.name;
  var user = req.user;
  var security = securitymodel.findSecurity(name);
  socket.join(name);
  console.log('A user ('+req.username+') joined ' + name);
  io.to(name).emit('secjoin', req);
});

// user leaves room
socket.on('secleave', function (req) {
  console.log(req);
  var name = req.name;
  var user = req.user;
  var security = securitymodel.findSecurity(name);
  console.log('A user left ' + name);
  io.to(name).emit('secleave', user);
});
};
