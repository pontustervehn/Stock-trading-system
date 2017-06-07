/* jslint node: true */
"use strict";

/**
 * A module that contains the order object!
 * @module orderSystem
 */

var orderList = [];
var orderID = 0;
console.log("order orderID: "+ orderID);


/**
 * Creates a security with the given name.
 * @param {String} name -
 */
function Order(orderId, uID, type, sec, amt, price, date) {
    this.orderId = orderId;    //unique orderid
    this.userId = uID;     //userid/name of person who placed order
    this.type = type;       //buying or selling
    this.security = sec;   //name of security in order
    this.amount = amt;     //amount of securities in order
    this.price = price;      //price per security in order
    this.dateAdded = date;  //when the order was made, loop through (compare) earlier orders first
    }


/**
 * Creates a security with the given name.
 * @param {String} name - The name of  the security.
 */


exports.addOrder = function (uID, type, sec, amt, price) {
  var id = orderID;
  var date = "1 june";
  var newOrder = new Order(id, uID, type, sec, amt, price, date);
  orderList.push(newOrder);
  orderID = orderID+=1;
  //console.log("orderid after adding a new order: " + orderID);
  console.log("\nAdded new order: " + newOrder.orderId+ " " + newOrder.userId + " " + newOrder.type + " " + newOrder.security+ " " + newOrder.amount+ " " + newOrder.price+ " " + newOrder.dateAdded + "\n");
};


/**
 * Returns all the Securities.
 */
exports.getOrders = function() {
  return orderList;
};

/**
 * Removes the order object with the matching name.
 * @param {String} name - The name of the order.
 */

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

//items.splice(2, 1, 1010); replaces object at index 2 with the entry 1010

/**
 * Removes the security object with the matching name.
 * @param {String} name - The name of the security.
 */
exports.updateOrder = function(id, amt){
 for (var i = 0; i < orderList.length; i++) {
   var order = orderList[i];
   if (order.orderId === id) {
     order.amount = amt;
     break;
   }
 }
};
/**
 * Return the security object with the matching name.
 * @param {String} name - The name of the security.
 */
exports.findOrder = function(name) {
  for (var i = 0; i < orderList.length; i++) {
    if (orderList[i].name === name) {
      return orderList[i];
    }
  }
};
