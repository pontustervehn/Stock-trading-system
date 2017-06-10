/* jslint node: true */
"use strict";

var securityList = [];

function Security(name) {
    this.name = name;
}

exports.addSecurity = function (name) {
  var newSecurity = new Security(name);
  securityList.push(newSecurity);
};

exports.getSecurities = function() {
  return securityList;
};

exports.removeSecurity = function(name){
  for (var i = 0; i < securityList.length; i++) {
    var security = securityList[i];
    if (security.name === name) {
      securityList.splice(i, 1);
      security.remove();
      break;
    }
  }
};

exports.findSecurity = function(name) {
  for (var i = 0; i < securityList.length; i++) {
    if (securityList[i].name === name) {
      return securityList[i];
    }
  }
};
