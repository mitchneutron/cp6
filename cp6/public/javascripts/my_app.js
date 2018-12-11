//This is the client-side JS

angular.module('myApp', []).
  controller('myController', ['$scope', '$http',
                              function($scope, $http) {
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