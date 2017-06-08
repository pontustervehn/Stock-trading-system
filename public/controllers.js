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
      console.log("YYYYYY");
      $scope.$apply(function(){
        console.log("ZZZZZZ");
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
      console.log("ÅÅÅÅÅÅ");
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

/*
    socket.on('addsec', function (data) {
      console.log("BBBBBB");
      console.log("Inne i add sec socket on i controllers.js");
      $scope.$apply(function(){
        console.log("CCCCCC");
        console.log("Pushar " + data.securityName + "till securities scope.");

        $scope.securities.push(data.securityName);
      });
    });
    */

    /*
    socket.on('addsec', function (data) {
    $scope.$apply(function(){
        console.log("\nPushing to securities\n");
        $scope.securities.push(data.name);
      });
    });
    */

    /*
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

        socket.on('addsec', function (data) {
          $scope.$apply(function(){
            $scope.securities.push(data.secname);
          });
        });*/

    /*
    $scope.orders = [];
    http.get("/orderList", function(data) {
      $scope.orders = data.list;
    });

    $scope.trades = [];
    http.get("/tradeList", function(data) {
      $scope.trades = data.list;
    });*/

    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security.name);
      $location.hash("");
      $location.path('/security/' + security.name);
    };

    $scope.secdone = function() {
      console.log("AAAAAA");
      console.log("Reached secdone() function");
      console.log("emitting addsec for " + $scope.sec);
      socket.emit("addsec", {security:$scope.sec});
      //socket.emit("updateseclist", {room:$scope.room}); // Lade till denna
      $scope.sec = "";


      /*$http({
        method: 'POST',
        url: '/API',
        data: {'security': $scope.sec},
        headers: {'Content-Type': 'application/json'}
      })*/
      //socket.on('addsec', function (data) {
      //});

      //$location.path('about');
    };

//------------------------------------------
/*
    socket.on('addsec', function (req) {
      console.log("You added Security: " + req.security);
      var securityName = req.security;
      io.to(securityName).emit('addsec', req);
      securitymodel.addSecurity(securityName);
    });
    socket.on('addsec', function (data) {
        console.log("\nPushing to securities\n");
        $scope.securities.push(data.username);
    });
*/
//------------------------------------------

  }
]);

chattControllers.controller('securityController', ['$scope', 'HttpService', '$routeParams', 'UserService',
  function($scope, http, $routeParams, user) {
    $scope.security = $routeParams.security;
    $scope.mess = "";
    $scope.entries = [];


      //Lade till denna
     // $scope.entries = ["always", "leaving", "from", "recieve", "me", "down"];
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

    socket.on('addsec', function (data) {
      console.log("BBBBBB");
      console.log("Inne i add sec socket.on i controllers.js");
      $scope.$apply(function(){
        console.log("CCCCCC");
        console.log("Pushar " + data.securityName + "till securities scope.");

        $scope.securities.push(data.securityName);
      });
    });

    socket.on('placeorder', function (data) {
      console.log("Inne i placeorder socket.on i controllers.js");
      console.log("Med följande data: " + data.username + data.type + data.secname + data.amount + data.price);
      var date = "31 june";
      $scope.$apply(function(){
        //$scope.orders.push(data.securityName);

        //$scope.orders = [];
        http.get("/orderList/"+$scope.security, function(data) {
          $scope.orders = data.list;
        });

        http.get("/tradeList/"+$scope.security, function(data) {
          $scope.trades = data.list;
        });
        //$scope.orders.push(data.username, data.type, data.amount, data.price, date);
      });
    });

    socket.on('secupdate', function (data) {
      $scope.$apply(function(){
        console.log("update");
        console.log(data);
        $scope.entries.push(data.username + ": " + data.update);
      });
    });

    socket.on('secjoin', function (data) {
      $scope.$apply(function(){
        console.log(" inside secjoin in controllers.js");
        console.log(data);
        //$scope.entries.push(data.username + " joined the channel");
      });
    });


    $scope.redirect = function(security) {
      console.log("Trying to enter security : " + security.name);
      $location.hash("");
      $location.path('/security/' + security.name);
    };

    $scope.placeorder = function() {
      console.log("Reached placeorder()");
      socket.emit("placeorder", {type:$scope.type, amount:$scope.amount, price:$scope.price, username:user.getName(), secname:$scope.security});
      $scope.type = "";
      $scope.amount = "";
      $scope.price = "";
    };
  }
]);

//-------------------------------------------------------------------------------------------------
chattControllers.controller('aboutController', ['$scope',
  function($scope) {
  }
]);

chattControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
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
