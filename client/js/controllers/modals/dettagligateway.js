angular.module('pdp',['angularFileUpload']).controller('dettagliGatewayController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Connector',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Connector) {
               

    console.log("inputs GATEWAY",inputs)

    $scope.name = inputs.name;
    $scope.email = inputs.email;
    $scope.secondmail = inputs.secondmail
    $scope.description = inputs.description;
   

  	

    $scope.hasgateway = false; // parametro per mostrare la tabella gateway se l'azienda ne ha 

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


	initializate()


	function initializate(){


	}


	$scope.updateGateway = function(){

		if($scope.name == null || $scope.name.length <= 0){
			 toastr.error("Non è stato inserito un nome gateway", "Avviso",opts);
             return;
		}

		/*if($scope.description == null || $scope.description.length <= 0){
			 toastr.error("Non è stato inserita una descrizione gateway", "Avviso",opts);
             return;
		}*/

		

		var obj = {
    		name:$scope.name,        				        		      		
    		description:$scope.description, 
    		email:$scope.email,
    		secondmail:$scope.secondmail  		
    		
    	} 

    	console.log("OGGETTO",obj)       	

    	Gateway.updateAttributes({id:inputs.id},obj).$promise.then(function(gtw){        		
    		
    		console.log("FATTO",gtw)

    		toastr.success("Gateway aggiornato correttamente", "Avviso",opts); 

    		close(gtw)       		

    	});	

	}




}])