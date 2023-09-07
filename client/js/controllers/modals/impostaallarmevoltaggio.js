angular.module('pdp',['angularFileUpload']).controller('impostaAllarmeVoltaggioController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Sensorvaluelimit','Sensorvaluelimitrele',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Sensorvaluelimit,Sensorvaluelimitrele) {
             

    console.log("inpus",inputs)

    $scope.sensortypename = inputs.voltsensor[0].sensortype.name

    $scope.paramodel = {min:null,max:null,value:null,code:inputs.voltsensor[0].code,emailsent:0}

    $scope.hasLimits = false    

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

    	var set = eval(inputs.voltsensor[0].sensortype.settings)

    	$scope.settings = JSON.parse(set)    	

    	for(var pa in $scope.settings){                

          parameters.push(pa)

      	}      	     

      	$scope.parameters = parameters      	

      	if(inputs.voltsensor[0].hasOwnProperty('sensorvaluelimits')){

      		$scope.hasLimits = true;

      		$scope.paramodel = inputs.voltsensor[0].sensorvaluelimits

      	}else{
      		$scope.hasLimits = false;
      	}


    }



     $scope.deleteSensorAlarm = function(){

    	console.log("inputs",inputs)

    	 Sensorvaluelimit.deleteById({id:inputs.voltsensor[0].sensorvaluelimits.id}).$promise.then(function(sensorvalue) {  

    	 		close()

        		toastr.success("Allarme sensore eliminato correttamente", "Avviso",opts); 
    	 });

    }


    $scope.updateSensorAlarm = function(){

    	console.log("PARA",$scope.paramodel)

		Sensorvaluelimit.updateAttributes({id:inputs.voltsensor[0].sensorvaluelimits.id},$scope.paramodel).$promise.then(function(senvallim){        		
        		
        		close()

        		toastr.success("Allarme sensore aggiornato correttamente", "Avviso",opts); 

        });

    }


    $scope.createSensorAlarm = function(){

    	Sensorvaluelimit.create($scope.paramodel).$promise.then(function(senvallim){        		

        		
        		close()

        		toastr.success("Allarme sensore creato correttamente", "Avviso",opts); 

        });


    }


}]);