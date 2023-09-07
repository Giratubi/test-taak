angular.module('pdp',['angularFileUpload']).controller('dettagliTipoAllarmeController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Alarmtype','$timeout','inputs','close',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Alarmtype,$timeout,inputs,close) {
               



    $scope.name = inputs.name
    $scope.code = inputs.code
    $scope.description = inputs.description

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



    $scope.updateAlarmType = function(){


    		if($scope.name == null || $scope.name.length <= 0){
    			 toastr.error("Non è stato inserito un nome azienda", "Avviso",opts);
                 return;
    		}

    		if($scope.code == null || $scope.code.length <= 0){
    			 toastr.error("Non è stato inserito un codice identificativo", "Avviso",opts);
                 return;
    		} 

        	$scope.isdisabled = true;


    		var obj = {
        		name:$scope.name,
        		code:$scope.code,		        		      		
        		description: $scope.description
        		
        	}

        	Alarmtype.updateAttributes({id:inputs.id},obj).$promise.then(function(Alarmtype){        		

        		$scope.name = '';
        		$scope.code = '';		        		
        		$scope.description = '';
        		
        		close(200);

        		toastr.success("Tipo allarme aggiornato correttamente", "Avviso",opts);      		

        		$scope.isdisabled = false;

        		

        	});	

        }    




}])