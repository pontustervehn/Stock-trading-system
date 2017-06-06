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


socket.on('placeorder', function (req) {
  if (req.username === ''){
    req.username = "Anonymous";
  } else {}
  //socket.emit("placeorder", {amount:$scope.buyamount, price:$scope.buyprice, username:user.getName(), secname:$scope.security});
  console.log("You added " +req.type+ "-order: \nAmount: " + req.amount + "\nPrice: " + req.price + "\nUsername: " + req.username + "\nSecurityname: " + req.secname);
  var uname = req.username;
  var type = req.type
  var secname = req.secname;
  var amount= req.amount;
  var price = req.price;

  console.log("Före getOrders");
  var orders = order.getOrders();
  console.log("Före for-loopen" + orders);
  //TO-DO: MÅSTE HANTERA INDEX SOM ÄNDRAS MED TIDEN UNDER LOOPENS GÅNG
  for (var i = 0; i < orders.length; i+=1) {
    console.log("Inne i for-loopen");
    //Kanske lägg till if-sats här för att kolla så att order.secname matchar rätt security för view
    if ((orders[i].security===secname) && (orders[i].type!==type) && (orders[i].price === price) && (orders[i].amount===amount)){
      //add or send info to completed trades
      console.log("Removing sell-order");
      io.to(orderId).emit('placeorder', req);
      order.removeOrder(orders[i].orderId);
      console.log("breaking loop at first if");
      break;

    } else if ((orders[i].security===secname) && (orders[i].type!==type) && (orders[i].price === price) && (orders[i].amount>amount)) {
        //add or send info to completed trades
      var newAmount = orders[i].amount - amount
      console.log("Updating sell-order");
      io.to(orderId).emit('placeorder', req);
      order.updateOrder(orders[i].orderId, newAmount);
      console.log("breaking loop at second if");
      break;

    } else if ((orders[i].security===secname) && (orders[i].type!==type) && (orders[i].price === price) && (orders[i].amount<amount)) {
        //add or send info to completed trades
        console.log("Removing sell-order");
        io.to(orderId).emit('placeorder', req);
        order.removeOrder(orders[i].orderId);

        console.log("Adding buy order with lowered amount");
        var newAmount2 = orders[i].amount - amount
          io.to(uname, type, secname, newAmount2, price).emit('placeorder', req);
          order.addOrder(uname, type, secname, newAmount2, price);

        console.log("Continuing loop at third if");

    } else {
      io.to(uname, type, secname, amount, price).emit('placeorder', req);
      order.addOrder(uname, type, secname, amount, price);
      console.log("breaking loop at else");
      break;
    }

  }
/*function Order(orderId, uID, type, sec, amt, price, date) {
    this.orderId = orderId;    //unique orderid
    this.userId = uID;     //userid/name of person who placed order
    this.type = type;       //buying or selling
    this.security = sec;   //name of security in order
    this.amount = amt;     //amount of securities in order
    this.price = price;      //price per security in order
    this.dateAdded = date;  //when the order was made, loop through (compare) earlier orders first
  }*/

//  io.to(uname, type, secname, amount, price).emit('placeorder', req);
//  order.addOrder(uname, type, secname, amount, price);
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
