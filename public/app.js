(function(){
  var app = angular.module("trade", [
  'ngRoute',
  'tradeControllers',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
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
        redirectTo: '/seclist'
      });
  }]);
})();
