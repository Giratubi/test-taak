angular.module('pdp',['angularFileUpload']).controller('dettagliTipoSensoreController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Sensortype','$timeout','inputs','close',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Sensortype,$timeout,inputs,close) {
               



    $scope.name = inputs.name
    $scope.code = inputs.code
    $scope.unitmeasure = inputs.unitmeasure
    $scope.description = inputs.description
    $scope.settings = inputs.settings;

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



    $scope.updateSensorType = function(){


    		if($scope.name == null || $scope.name.length <= 0){
    			 toastr.error("Non è stato inserito un nome azienda", "Avviso",opts);
                 return;
    		}

    		if($scope.code == null || $scope.code.length <= 0){
    			 toastr.error("Non è stato inserito un codice identificativo", "Avviso",opts);
                 return;
    		} 

    		if($scope.unitmeasure == null || $scope.unitmeasure.length <= 0){
    			 toastr.error("Non è stata inserita un unità di misura", "Avviso",opts);
                 return;
    		}

            if($scope.settings == null || $scope.settings.length <= 0){
                 toastr.error("Non sono stati inseriti i settaggi", "Avviso",opts);
                 return;
            }  

        	$scope.isdisabled = true;


    		var obj = {
        		name:$scope.name,
        		code:$scope.code,
        		unitmeasure:$scope.unitmeasure,		        		      		
        		description: $scope.description,
                settings:$scope.settings
        		
        	}

        	Sensortype.updateAttributes({id:inputs.id},obj).$promise.then(function(sensortype){        		

        		$scope.name = '';
        		$scope.code = '';
        		$scope.unitmeasure = '';		        		
        		$scope.description = '';
                $scope.settings = '';
        		
        		close(200);

        		toastr.success("Tipo sensore aggiornato correttamente", "Avviso",opts);      		

        		$scope.isdisabled = false;

        		

        	});	

        }    




}])