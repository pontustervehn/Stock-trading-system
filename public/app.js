(function(){
  var app = angular.module("chat", [
  'ngRoute',
  'chattControllers',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'list.html',
        controller: 'listController'
      }).
      when('/about', {
        templateUrl: 'about.html',
        controller: 'aboutController'
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/room/:room', {
        templateUrl: 'room.html',
        controller: 'roomController'
      }).
      when('/seclist', {
        templateUrl: 'seclist.html',
        controller: 'seclistController'
      }).
      when('/security/:security', {
        templateUrl: 'security.html',
        controller: 'securityController'
      }).
      otherwise({
        redirectTo: '/list'
      });
  }]);
})();
