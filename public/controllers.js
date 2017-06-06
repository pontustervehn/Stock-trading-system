var chattControllers = angular.module('chattControllers', []);

chattControllers.controller('listController', ['$scope', '$location',  'HttpService',
  function($scope, $location, http) {

    $scope.rooms = [];
    http.get("/roomList", function(data) {
      $scope.rooms = data.list;
    });
    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/room/' + room.name);
    };
  }
]);

chattControllers.controller('roomController', ['$scope', 'HttpService', '$routeParams', 'UserService',
  function($scope, http, $routeParams, user) {
    $scope.room = $routeParams.room;
    $scope.mess = "";
    $scope.entries = [];
    // $scope.entries = ["always", "leaving", "from", "recieve", "me", "down"];
    http.get("/room/"+$scope.room, function(data) {
      $scope.entries = data.list;
      socket.emit("join", {name:$scope.room, username: user.getName()});
    });
    var socket = io().connect();

    socket.on('update', function (data) {
      $scope.$apply(function(){
        console.log("update");
        console.log(data);
        $scope.entries.push(data.username + ": " + data.update);
      });
    });

    socket.on('join', function (data) {
      $scope.$apply(function(){
        console.log("join");
        console.log(data);
        $scope.entries.push(data.username + " joined the channel");
      });
    });

    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/room/' + room.name);
    };

    $scope.done = function() {
      console.log("Reached done()");
      socket.emit("update", {room:$scope.room, update:$scope.mess, username:user.getName()});
      $scope.mess = "";
    };

  }
]);



//-------------------------------------------------------------------------------------------------
//added below part
//-------------------------------------------------------------------------------------------------



chattControllers.controller('seclistController', ['$scope', '$location',  'HttpService', 'UserService',
  function($scope, $location, http, user) {

    var socket = io().connect();
    $scope.sec = ""; //Lade till denna
    $scope.securities = [];
    http.get("/securityList", function(data) {
      $scope.securities = data.list;
    });

    $scope.orders = [];
    http.get("/orderList", function(data) {
      $scope.orders = data.list;
    });

    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security.name);
      $location.hash("");
      $location.path('/security/' + security.name);
    };

    $scope.secdone = function() {
      console.log("Reached secdone()");
      /*$http({
        method: 'POST',
        url: '/API',
        data: {'security': $scope.sec},
        headers: {'Content-Type': 'application/json'}
      })*/


      //socket.on('addsec', function (data) {
      //});


      console.log($scope.sec);
      socket.emit("addsec", {security:$scope.sec});
      $scope.sec = "";
      //$location.path('about');
    };
  }
]);

chattControllers.controller('securityController', ['$scope', 'HttpService', '$routeParams', 'UserService',
  function($scope, http, $routeParams, user) {
    $scope.security = $routeParams.security;
    $scope.mess = "";
    $scope.entries = [];
    // $scope.entries = ["always", "leaving", "from", "recieve", "me", "down"];
    http.get("/security/"+$scope.security, function(data) {
      $scope.entries = data.list;
      socket.emit("secjoin", {name:$scope.security, username: user.getName()});
    });
    var socket = io().connect();

    socket.on('secupdate', function (data) {
      $scope.$apply(function(){
        console.log("update");
        console.log(data);
        $scope.entries.push(data.username + ": " + data.update);
      });
    });

    socket.on('secjoin', function (data) {
      $scope.$apply(function(){
        console.log("join");
        console.log(data);
        $scope.entries.push(data.username + " joined the channel");
      });
    });

    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security.name);
      $location.hash("");
      $location.path('/security/' + security.name);
    };

    $scope.buy = function() {
      console.log("Reached buy()");
      socket.emit("addbuyorder", {bamount:$scope.buyamount, bprice:$scope.buyprice, username:user.getName(), secname:$scope.security});
      $scope.buyamount = "";
      $scope.buyprice = "";
    };

    $scope.sell = function() {
      console.log("Reached sell()");
      socket.emit("addsellorder", {samount:$scope.sellamount, sprice:$scope.sellprice, username:user.getName(), secname:$scope.security});
      $scope.sellamount = "";
      $scope.sellprice = "";
    };



  }
]);


/*
chattControllers.controller('addController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.name = "";
    $scope.done = function() {
      console.log("Reached done()");
      http.post('addSecurity', {realname: $scope.name}, function(response) {
        console.log(response);
        user.setName($scope.name);
        $location.path('seclist');
      });
    };
  }*/




//]);



//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

chattControllers.controller('aboutController', ['$scope',
  function($scope) {

  }
]);

chattControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.name = "";
    $scope.done = function() {
      console.log("Reached done()");
      http.post('setUser', {realname: $scope.name}, function(response) {
        console.log(response);
        user.setName($scope.name);
        $location.path('seclist');
      });
    };

  }
]);

chattControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);
