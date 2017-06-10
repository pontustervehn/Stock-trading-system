/* jslint node: true */
"use strict";

var tradeList = [];

function Trade(sec, b, s, amt, pri, date) {
    this.security = sec;
    this.buyer = b;
    this.seller = s;
    this.amount = amt;
    this.price = pri;
    this.date = date;
    }

exports.addTrade = function (sec, b, s, amt, pri) {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var date = year + "/" + month + "/" + day;

  var newTrade = new Trade(sec, b, s, amt, pri, date);
  tradeList.push(newTrade);
};

exports.getTrades = function() {
  return tradeList;
};

exports.findTrade = function(name) {
  for (var i = 0; i < tradeList.length; i++) {
    if (tradeList[i].name === name) {
      return tradeList[i];
    }
  }
};
