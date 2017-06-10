/* jslint node: true */
"use strict";

var orderList = [];
var orderID = 0;

function Order(orderId, uName, type, sec, amt, price, date) {
    this.orderId = orderId;    //unique orderid
    this.userName = uName;     //userName/name of person who placed order
    this.type = type;       //buying or selling
    this.security = sec;   //name of security in order
    this.amount = amt;     //amount of securities in order
    this.price = price;      //price per security in order
    this.dateAdded = date;  //when the order was made, loop through (compare) earlier orders first
    }

exports.addOrder = function (uID, type, sec, amt, price) {
  var id = orderID;
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var date = year + "/" + month + "/" + day;
  var newOrder = new Order(id, uID, type, sec, amt, price, date);
  orderList.push(newOrder);
  orderID = orderID+=1;
  //console.log("orderid after adding a new order: " + orderID);
  console.log("\nAdded new order: " + newOrder.orderId+ " " + newOrder.userName + " " + newOrder.type + " " + newOrder.security+ " " + newOrder.amount+ " " + newOrder.price+ " " + newOrder.dateAdded + "\n");
};

exports.getOrders = function() {
  return orderList;
};

exports.removeOrder = function(id){
  for (var i = orderList.length-1; i >= 0; i--) {  //REVERSE ORDER TO KEEP RIGHT INDEXIS AND NOT SKIP POSTS
  //for (var i = 0; i < orderList.length; i++) {  //WAS NOT IN REVERSE ORDER
    var order = orderList[i];
    if (order.orderId === id) {
      orderList.splice(i, 1);
      //order.remove();
      break;
    }
  }
};

exports.updateOrder = function(id, amt){
 for (var i = 0; i < orderList.length; i++) {
   var order = orderList[i];
   if (order.orderId === id) {
     order.amount = amt;
     break;
   }
 }
};

exports.findOrder = function(name) {
  for (var i = 0; i < orderList.length; i++) {
    if (orderList[i].name === name) {
      return orderList[i];
    }
  }
};
