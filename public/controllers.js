var tradeControllers = angular.module('tradeControllers', []);

tradeControllers.controller('seclistController', ['$scope', '$location',  'HttpService', 'UserService',
  function($scope, $location, http, user) {

    var socket = io().connect();

    $scope.sec = "";
    $scope.securities = [];
    http.get("/securityList", function(data) {
      $scope.securities = data.list;
    });
    socket.emit("joinseclist");

    //Populates security list dynamically
    socket.on('addsec', function (data) {
      $scope.$apply(function(){
        http.get("/securityList", function(data) {
        $scope.securities = data.list;
        });
      });
    });

    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security.name);
      $location.hash("");
      $location.path('/security/' + security.name);
    };

    //add security button pressed emits addsec through socket
    $scope.secdone = function() {
      console.log("Emitting addsec through socket with " + $scope.sec);
      socket.emit("addsec", {security:$scope.sec});
      $scope.sec = "";
    };
  }
]);

tradeControllers.controller('securityController', ['$scope', 'HttpService', '$routeParams', 'UserService',
  function($scope, http, $routeParams, user) {
    $scope.security = $routeParams.security;
    $scope.mess = "";
    $scope.entries = [];

     http.get("/security/"+$scope.security, function(data) {
     $scope.entries = data.list;
     socket.emit("secjoin", {name:$scope.security, username: user.getName()});
     });

    $scope.orders = [];
    http.get("/orderList/"+$scope.security, function(data) {
      $scope.orders = data.list;
    });

    $scope.trades = [];
    http.get("/tradeList/"+$scope.security, function(data) {
      $scope.trades = data.list;
    });

    var socket = io().connect();

    //Updates (populates) orderlists and tradelists in browser
    socket.on('updateorderlist', function (data) {
      $scope.$apply(function(){
        http.get("/orderList/"+$scope.security, function(data) {
          $scope.orders = data.list;
        });

        http.get("/tradeList/"+$scope.security, function(data) {
          $scope.trades = data.list;
        });
      });
    });

    socket.on('secjoin', function (data) {
      $scope.$apply(function(){
      });
    });

    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security.name);
      $location.hash("");
      $location.path('/security/' + security.name);
    };

    $scope.placeorder = function() {
      socket.emit('placeorder', {type:$scope.type, amount:$scope.amount, price:$scope.price, username:user.getName(), secname:$scope.security});
      $scope.type = "";
      $scope.amount = "";
      $scope.price = "";
    };
  }
]);

tradeControllers.controller('aboutController', ['$scope',
  function($scope) {
  }
]);

tradeControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.name = "";
    $scope.done = function() {
      console.log("Logged in as " + $scope.name);
      http.post('setUser', {realname: $scope.name}, function(response) {
        console.log(response);
        user.setName($scope.name);
        $location.path('seclist');
      });
    };
  }
]);

tradeControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
    };
  }
]);
