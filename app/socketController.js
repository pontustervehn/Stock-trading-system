/* jslint node: true */
"use strict";

var model = require('./model.js');

//:::::::::::::::::::::::::::::::::::::::::::::::::::
var securitymodel = require('./securitymodel.js');
var order = require('./order.js');
var trade = require('./trade.js');
//:::::::::::::::::::::::::::::::::::::::::::::::::::

module.exports = function (socket, io) {

  // user joins room
  socket.on('join', function (req) {
    console.log(req);
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);
    // room.addUser(user);
    socket.join(name);
    console.log('A user ('+req.username+') joined ' + name);
    io.to(name).emit('join', req);
    room.addMessage(req.username + " joined the channel");
  });

  // user gets updated
  socket.on('update', function (req) {
    console.log(req);
    console.log("XXXXXX");
    var roomName = req.room;
    io.to(roomName).emit('update', req);
    var room = model.findRoom(roomName);
    room.addMessage(req.username + ": " + req.update);
  });

  // user leaves room
  socket.on('leave', function (req) {
    console.log(req);
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);
    // room.removeUser(user);
    console.log('A user left ' + name);
    io.to(name).emit('leave', user);
  });


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
socket.on('joinseclist', function (req) {
  console.log("Inne i joinseclist");
  socket.join("seclist");
});



socket.on('addsec', function (req) {
  console.log("DDDDDD");
  console.log("Efter emitting från controllers.js, denna är i socketcontroller.js");

  console.log("You added Security: " + req.security);
  var secname = req.security;
  io.to(secname).emit('addsec', req);
  securitymodel.addSecurity(secname);

  //socket.join("seclist");
  io.to("seclist").emit('addsec', req);
});

socket.on('placeorder', function (req) {
  if (req.username === ''){
    req.username = "Anonymous";
  } else {}
  //socket.emit("placeorder", {amount:$scope.buyamount, price:$scope.buyprice, username:user.getName(), secname:$scope.security});
  console.log("\nYou added " +req.type+ "-order: Amount: " + req.amount + " Price: " + req.price + " Username: " + req.username + " Securityname: " + req.secname + "\n");
  var uname = req.username;
  var type = req.type
  var secname = req.secname;
  var amount= req.amount;
  var price = req.price;

  function orderCheck(amount) {
    var noOrderMatches = true

    if (order.getOrders().length <= 0){
      console.log("Arrayen är tom. Lägger till första ordern.");
      io.to(secname).emit('placeorder', req);
      order.addOrder(uname, type, secname, amount, price);
      noOrderMatches = false;
    } else {

      var orders = order.getOrders();

      for (var i = 0; i < orders.length; i+=1) { //ändrade från i++
        //console.log("Inne i for-loopen");
        var newAmount = 0;
        //Kanske lägg till if-sats här för att kolla så att order.secname matchar rätt security för view
        if ((orders[i].security===secname) && (orders[i].type!==type) && (orders[i].price === price)){
          if (orders[i].amount===amount){
            console.log("Setting " + orders.type + "-order amount to 0");
            io.to(secname).emit('placeorder', req);
            order.updateOrder(order.getOrders()[i].orderId, 0);
            noOrderMatches = false;

            console.log("\nAdding order to completed trades..\n");
            if (type === "buying"){
            io.to(secname).emit('placeorder', req);
            trade.addTrade(secname,uname,orders[i].userName,amount, price);
            } else {
            io.to(secname).emit('placeorder', req);
            trade.addTrade(secname,orders[i].userName,uname,amount, price);
            }
//exports.addTrade = function (sec, b, s, amt, pri) {
            break;

          } else if (orders[i].amount>amount) {
            //add or send info to completed trades
            newAmount = orders[i].amount - amount;
            console.log("Updating " + orders[i].type + "-order");
            io.to(secname).emit('placeorder', req);
            order.updateOrder(order.getOrders()[i].orderId, newAmount);
            noOrderMatches = false;

            console.log("\nAdding order to completed trades..\n");
            if (type === "buying"){
            io.to(secname).emit('placeorder', req);
            trade.addTrade(secname,uname,orders[i].userName,amount, price);
            } else {
            io.to(secname).emit('placeorder', req);
            trade.addTrade(secname,orders[i].userName,uname,amount, price);
            }

            break;

          } else if ((orders[i].amount<amount) && (orders[i].amount>0)) {
            //add or send info to completed trades
            var originalAmount = orders[i].amount;
            newAmount = amount - orders[i].amount;
            console.log("Setting " + orders[i].type + "-order amount to 0");
            io.to(secname).emit('placeorder', req);
            order.updateOrder(order.getOrders()[i].orderId, 0);
            noOrderMatches = false;

            console.log("\nAdding order to completed trades..\n");
            if (type === "buying"){
            io.to(secname).emit('placeorder', req);
            trade.addTrade(secname,uname,orders[i].userName,originalAmount, price);
            } else {
            io.to(secname).emit('placeorder', req);
            trade.addTrade(secname,orders[i].userName,uname,originalAmount, price);
            }

            orderCheck(newAmount); //Låter orderCheck gå om med ny (lowered) amount

        } else {}
      } else {}
    }
  }

  if (noOrderMatches){
    console.log("runs if noOrdermatches");
    io.to(secname).emit('placeorder', req);
    order.addOrder(uname, type, secname, amount, price);
    //console.log("breaking loop at else");
  } else {}

  noOrderMatches = true;

  //Removes empty orders (amount=0) from orderList
  for (var i = 0; i < order.getOrders().length; i+=1) {
    if (order.getOrders()[i].amount===0){
      console.log("Removing zero-amount " + order.getOrders()[i].type + "-order");
      io.to(secname).emit('placeorder', req);
      order.removeOrder(order.getOrders()[i].orderId);
    } else {}
  }
  return
  }

  orderCheck(amount);
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// user joins room
socket.on('secjoin', function (req) {
  console.log(req);
  var name = req.name;
  var user = req.user;
  var security = securitymodel.findSecurity(name);
  // room.addUser(user);
  socket.join(name);
  console.log('A user ('+req.username+') joined ' + name);
  io.to(name).emit('secjoin', req);
  //security.addMessage(req.username + " joined the channel");
});

// user gets updated
socket.on('secupdate', function (req) {
  console.log(req);
  var securityName = req.room;
  io.to(securityName).emit('secupdate', req);
  var security = model.findRoom(securityName);
  room.addMessage(req.username + ": " + req.update);
  if (req.update=="testing123") {
    room.addMessage("YEAAAH BABY!");
  } else {
  }
  console.log("YEAAAH");
});

// user leaves room
socket.on('secleave', function (req) {
  console.log(req);
  var name = req.name;
  var user = req.user;
  var security = model.findSecurity(name);
  // room.removeUser(user);
  console.log('A user left ' + name);
  io.to(name).emit('secleave', user);
});

};
