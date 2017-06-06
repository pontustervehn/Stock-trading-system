/* jslint node: true */
"use strict";

/**
 * A module that contains the security object!
 * @module securitySystem
 */

var securityList = [];


/**
 * Creates a security with the given name.
 * @param {String} name - The name of the security.
 */
function Security(name) {
    this.name = name;
    this.messages = [];
    this.users = [];

    this.addMessage = function(message){
      this.messages.push(message);
    };
}


/**
 * Creates a security with the given name.
 * @param {String} name - The name of the security.
 */
exports.addSecurity = function (name) {
  var newSecurity = new Security(name);
  securityList.push(newSecurity);
};

/**
 * Returns all the Securities.
 */
exports.getSecurities = function() {
  return securityList;
};

/**
 * Removes the security object with the matching name.
 * @param {String} name - The name of the security.
 */
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

/**
 * Return the security object with the matching name.
 * @param {String} name - The name of the security.
 */
exports.findSecurity = function(name) {
  for (var i = 0; i < securityList.length; i++) {
    if (securityList[i].name === name) {
      return securityList[i];
    }
  }
};
