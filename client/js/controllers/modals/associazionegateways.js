angular.module('pdp',['angularFileUpload']).controller('associazioneGatewaysController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Connector','Gatewaycompany',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Connector,Gatewaycompany) {
               

        
            console.log("ASSOCIAZIONE GAteways",inputs)

            $scope.gatewayname = inputs.name
           

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

                Company.find().$promise.then(function(comp) {                     

                    var finalcomp  = comp.filter(el => {
                              
                        if(el.companytypeId == 3) {    
                          return true;
                        }                  
                        return false; 
            
                    });

                    $scope.finalcompanies = finalcomp

                    var installationcomp  = comp.filter(el => {
                              
                        if(el.companytypeId == 2 || el.companytypeId  == 3) {    
                          return true;
                        }                  
                        return false; 
            
                    });
                     
                    $scope.installationcomp = installationcomp
                });

            }



            $scope.updateGateway = function(){

                if($scope.finalcompanyselected == null || $scope.finalcompanyselected.length <= 0){
                    toastr.error("Non è statselezionata l'azienda finale", "Avviso",opts);
                    return;
                }

                if($scope.instcompselected == null || $scope.instcompselected.length <= 0){
                    toastr.error("Non è statselezionata l'azienda installatrice", "Avviso",opts);
                    return;
                }

                SpinnerService.show('spinner');

                var obj = {companyId:$scope.finalcompanyselected.id,installationcompanyId:$scope.instcompselected.id}

                Gatewaycompany.updateAssociation({id:inputs.id},obj).$promise.then(function(gtw){ 

                    toastr.success("Nuova associazione Gateway avvenuta con successo", "Avviso",opts);
                    
                    SpinnerService.hide('spinner'); 
    
                    close(200)
    
                   })               

            }


           




}]);