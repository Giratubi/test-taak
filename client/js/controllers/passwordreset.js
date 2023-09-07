angular
  .module('pdp')
  .controller('passwordResetController',  ['$scope','$rootScope', 'AuthService', '$state','Messages','$urlRouter', 'Users', '$cookieStore','ModalService','$timeout','Company','SpinnerService','$location',
   function($scope,$rootScope, AuthService, $state, Messages, $urlRouter, Users, $cookieStore,ModalService,$timeout,Company,SpinnerService,$location) {
    

   		


   		$rootScope.isLoginPage        = true;
    	$rootScope.isLightLoginPage   = false;
    	$rootScope.isLockscreenPage   = false;
    	$rootScope.isMainPage         = false;


    	 var opts = {
          "closeButton": true,
          "debug": false,
          "positionClass": "toast-bottom-right",
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        };



    	$scope.setPassword = function() {

		        console.log($scope.password);
		        console.log($scope.confirmPassword);

		        if($scope.password != $scope.confirmPassword){
	                 toastr.error("le password non coincidono", "Avviso",opts);
	                 
	                 return;
	            }
		        

		        if($scope.password == $scope.confirmPassword){
		          
		          var token = $location.search().access_token;
		          console.log('TOKEN',token);
		          AuthService.setNewPassword(token,$scope.password).then(function() {

		          	toastr.success("Reset password avvenuto con successo", "Avviso",opts);

					$timeout(function(){

						 $state.go('login');

					},2500, false);

		          },function(errorResponse) {
		             $scope.error = JSON.parse(errorResponse.data.message);  
		             console.log("ERRORE RESET",$scope.error.form[0])

		             toastr.error($scope.error.form[0], "Avviso",opts);
		          });

		      	}

		}


    }])