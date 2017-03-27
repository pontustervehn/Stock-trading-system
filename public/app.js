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
      otherwise({
        redirectTo: '/list'
      });
  }]);
})();
