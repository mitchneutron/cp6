//This is the client-side JS

angular.module('myApp', []).
  controller('myController', ['$scope', '$http',
    function($scope, $http) {
      
      $scope.user = {};
      $scope.error = "";
      $scope.allNotes = [
        {username: "dog", note: "hello world this is dog"},  //TEMP DATA ONLY
        {username: "foo", note: "bar bar bar bar bar bar"},
        ];
                                
      // this is called first thing - checks if the current user is logged in and gets their data again
      $http.get('/user/profile').success(function(data, status, headers, config) {
        console.log(">>MyController: Got User: ", data);    
        
        $scope.user = data;
        $scope.error = "";
      }).error(function(data, status, headers, config) {
        console.log(">>MyController: error during GET User: ", data);
        
        $scope.user = {};
        $scope.error = data;
      });
    
    
      //Gets a list of all notes from the DB 
      $scope.getAllNotes = function() {
        console.log(">GetAllNotes() called");
        return $http.get('/notes').success(function(data){
          console.log(">GetAll(): Success, got response ");
          console.dir(data);
          
          angular.copy(data, $scope.allNotes);  //this copies the stuff coming back from the REST call into the scope array
        }).error(function(data){
          console.log(">GetAll(): Error during GET: ", data);
          
        });
      }; 
      $scope.getAllNotes(); //update the list of notes on the homepage asap
    
    
    
  }]);