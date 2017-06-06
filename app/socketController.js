/* jslint node: true */
"use strict";

var model = require('./model.js');

//:::::::::::::::::::::::::::::::::::::::::::::::::::
var securitymodel = require('./securitymodel.js');
var order = require('./order.js');
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
    var roomName = req.room;
    io.to(roomName).emit('update', req);
    var room = model.findRoom(roomName);
    room.addMessage(req.username + ": " + req.update);
    if (req.update=="testing123") {
      room.addMessage("YEAAAH BABY!");
    } else {
    }
    console.log("YEAAAH");

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
/*socket.on('addsec', function (req) {
  console.log(req);
  var securityName = req.security;
  io.to(securityName).emit('addsec', req);
  var security = securitymodel.addSecurity(securityName);
});*/

socket.on('addsec', function (req) {
  console.log("You added Security: " + req.security);
  var securityName = req.security;
  io.to(securityName).emit('addsec', req);
  securitymodel.addSecurity(securityName);
});


socket.on('addbuyorder', function (req) {
  if (req.username === ''){
    req.username = "Anonymous";
  } else {}
  //socket.emit("addbuyorder", {bamount:$scope.buyamount, bprice:$scope.buyprice, username:user.getName(), secname:$scope.security});
  console.log("You added Buyorder: \nAmount: " + req.bamount + "\nPrice: " + req.bprice + "\nUsername: " + req.username + "\nSecurityname: " + req.secname);
  var uname = req.username;
  var type = "buying";
  var secname = req.secname;
  var amount= req.bamount;
  var price = req.bprice;


  io.to(uname, type, secname, amount, price).emit('addbuyorder', req);
  order.addOrder(uname, type, secname, amount, price);
});

socket.on('addsellorder', function (req) {
  if (req.username === ''){
    req.username = "Anonymous";
  } else {}
  //socket.emit("addbuyorder", {bamount:$scope.buyamount, bprice:$scope.buyprice, username:user.getName(), secname:$scope.security});
  console.log("You added Sellorder: \nAmount: " + req.samount + "\nPrice: " + req.sprice + "\nUsername: " + req.username + "\nSecurityname: " + req.secname);
  var uname = req.username;
  var type = "selling";
  var secname = req.secname;
  var amount= req.samount;
  var price = req.sprice;
  io.to(uname, type, secname, amount, price).emit('addsellorder', req);
  order.addOrder(uname, type, secname, amount, price);
});


/*
exports.addOrder = function (uID, type, sec, amt, price) {
  var id = orderID;
  var date = "june";
  var newOrder = new Order(id, uID, type, sec, amt, price, date);
  orderList.push(newOrder);
  orderID = orderID++;
  console.log(orderID);
};
*/






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


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



};
