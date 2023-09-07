angular.module('pdp',['angularFileUpload']).controller('impostaAllarmeController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Sensorvaluelimit',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Sensorvaluelimit) {
             


    console.log("INPUST IMPOSTALLARME",inputs)


    $scope.sensortypename = inputs.sensortype.name

    $scope.paramodel = {min:null,max:null,value:null,code:inputs.connectorId+'_'+inputs.code+'_'+inputs.sensortype.id,emailsent:0}

    $scope.hasLimits = false

    $scope.isSwitch = false

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

    initializate(inputs)

    function initializate(inputs){

    	var parameters = []

    	var set = eval(inputs.sensortype.settings)

    	$scope.settings = JSON.parse(set)    	

    	for(var pa in $scope.settings){                

          parameters.push(pa)

      	}



      	if($scope.settings.value && $scope.settings.max == null && $scope.settings.min == null){
      		 $scope.isSwitch = true
      	}       

      	$scope.parameters = parameters

      	if(inputs.sensorvaluelimits.length > 0){

      		$scope.hasLimits = true;

      		$scope.paramodel = inputs.sensorvaluelimits[0]

      	}else{
      		$scope.hasLimits = false;
      		if($scope.isSwitch == true){
      			$scope.paramodel.value = false;
      		}
      	}


    }

    $scope.deleteSensorAlarm = function(){

    	console.log("inputs",inputs)

    	 Sensorvaluelimit.deleteById({id:inputs.sensorvaluelimits[0].id}).$promise.then(function(sensorvalue) {  

    	 		close()

        		toastr.success("Allarme sensore eliminato correttamente", "Avviso",opts); 
    	 });

    }


    $scope.updateSensorAlarm = function(){

    	

		Sensorvaluelimit.updateAttributes({id:inputs.sensorvaluelimits[0].id},$scope.paramodel).$promise.then(function(senvallim){        		
        		
        		close()

        		toastr.success("Allarme sensore aggiornato correttamente", "Avviso",opts); 

        });

    }


    $scope.createSensorAlarm = function(){

    	console.log("PARA in create",$scope.paramodel)

    	Sensorvaluelimit.create($scope.paramodel).$promise.then(function(senvallim){        		

        		
        		close()

        		toastr.success("Allarme sensore creato correttamente", "Avviso",opts); 

        });


    }



}])