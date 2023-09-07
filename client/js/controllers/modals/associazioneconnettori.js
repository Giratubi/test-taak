angular.module('pdp',['angularFileUpload']).controller('associazioneConnettoriController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Connector',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Connector) {
               

        
            console.log("ASSOCIAZIONE CONNETTORI",inputs)

            $scope.connectorname = inputs.name
            $scope.gateway = inputs.gatewayId

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

                Gateway.find().$promise.then(function(gat) { 

                    console.log("gat",gat)

                    var gtws  = gat.filter(el => {
                              
                        if(el.id == inputs.gatewayId) {    
                          return false;
                        }                  
                        return true; 
            
                  });
                     
                    $scope.gateways = gtws

                });

            }


            $scope.updateConnector = function(){

                console.log("gatewayselected",$scope.gatewayselected)

                if($scope.gatewayselected == null || $scope.gatewayselected.length <= 0){
                    toastr.error("Non è stato selezionato un nuovo gateway d'appartenenza", "Avviso",opts);
                    return;
                }

               SpinnerService.show('spinner'); 

               var obj = {gatewayId:$scope.gatewayselected.id}


               Connector.updateAssociation({id:inputs.id},obj).$promise.then(function(gtw){ 

                toastr.success("Nuova associazione connettore avvenuta con successo", "Avviso",opts);
                
                SpinnerService.hide('spinner'); 

                close(200)

               })

            }




}]);