angular
  .module('pdp')
  .controller('requestPasswordResetController',  ['$scope','$rootScope', 'AuthService', '$state','Messages','$urlRouter', 'Users', '$cookieStore','ModalService','$timeout','Company','SpinnerService','Gateway','Gatewayspositions','Connector','Rele','Gatewayradius','Sensorvalue','$interval','$timeout',
   function($scope,$rootScope, AuthService, $state, Messages, $urlRouter, Users, $cookieStore,ModalService,$timeout,Company,SpinnerService,Gateway,Gatewayspositions,Connector,Rele,Gatewayradius,Sensorvalue,$interval,$timeout) {
    

   		


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



    	$scope.resetPassword = function() {

    			if($scope.emailforrequest == null ){
	                 toastr.error("Non è stata inserito una mail corretta", "Avviso",opts);
	                 
	                 return;
	            }
      
        		AuthService.resetPassword($scope.emailforrequest).then(function() {

        			console.log("CHiamato reset pass",$scope.emailforrequest)

        			toastr.success("Richiesta di reset password inviata correttamente, riceverai una email con le relative istruzioni", "Avviso",opts);

					$timeout(function(){

						 $state.go('login');

					},2500, false);

        		},function(errorResponse) {
		             $scope.error = JSON.parse(errorResponse.data.message);  
		             console.log("ERRORE RESET",$scope.error.form[0])

		             toastr.error($scope.error.form[0], "Avviso",opts);
		        })
        }


    }])