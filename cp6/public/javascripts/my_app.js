//This is the client-side JS

angular.module('myApp', []).
  controller('myController', ['$scope', '$http',
                              function($scope, $http) {
                                
    // this is called first thing - checks if the current user is logged in and gets their data again
    $http.get('/user/profile') .success(function(data, status, headers, config) {
      console.log(">>MyController: Got User: ", data);    
      
      $scope.user = data;
      $scope.error = "";
    }).error(function(data, status, headers, config) {
      console.log(">>MyController: error during GET User: ", data);
      
      $scope.user = {};
      $scope.error = data;
    });
  }]);