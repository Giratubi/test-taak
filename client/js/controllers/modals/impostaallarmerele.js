angular.module('pdp',['angularFileUpload']).controller('impostaAllarmeReleController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Sensorvaluelimit','Sensorvaluelimitrele',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Sensorvaluelimit,Sensorvaluelimitrele) {
             

    

    $scope.name = inputs.name

    $scope.paramodel = {min:null,max:null,value:null,code:inputs.code,emailsent:0}

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


      if(inputs.hasOwnProperty('sensorvaluelimits')){

          $scope.hasLimits = true

          $scope.paramodel.value = inputs.sensorvaluelimits.value          

      }else{
         $scope.hasLimits = false

         $scope.paramodel.value = false;
        
      }

     
    }

    $scope.deleteSensorAlarm = function(){

        Sensorvaluelimit.deleteById({id:inputs.sensorvaluelimits.id}).$promise.then(function(sensorvalue) { 

          console.log("CANCELLATO",sensorvalue) 


          Sensorvaluelimitrele.delete_({sensovaluelimitsId:inputs.sensorvaluelimits.id}).$promise.then(function(sensorvaluerel) {  

                close()

                toastr.success("Allarme sensore eliminato correttamente", "Avviso",opts); 

            });
       });

    }


    $scope.updateSensorAlarm = function(){   

		    Sensorvaluelimit.updateAttributes({id:inputs.sensorvaluelimits.id},$scope.paramodel).$promise.then(function(senvallim){           	
        		
        		close()

        		toastr.success("Allarme Relè aggiornato correttamente", "Avviso",opts); 

        });

    }


    $scope.createSensorAlarm = function(){     

    	Sensorvaluelimit.create($scope.paramodel).$promise.then(function(senvallim){           

          var obj = {sensorvaluelimitsId:senvallim.id,releId:inputs.id,emailsent:0}

          Sensorvaluelimitrele.create(obj).$promise.then(function(senvallimrel){
        		
        		close()

        		toastr.success("Allarme Relè creato correttamente", "Avviso",opts); 

          });
      });


    }



}])