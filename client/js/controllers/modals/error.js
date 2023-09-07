var app = angular.module('pdp');

app.controller('errorController', ['$scope', 'close', 'title','text', function($scope, close, title, text) {

  $scope.title = title;
  $scope.text = text;	

  $scope.close = function(result) {
 	  close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);