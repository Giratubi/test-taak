angular.module('pdp',['angularFileUpload']).controller('visualizzaAllarmiController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Alarm','$timeout',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Alarm,$timeout) {
               


    console.log("SONO IN VISUALIZZA ALLARMI")



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


    		AuthService.getCurrentUser(function(currentUser){ 


    			var companyId = null
    			var installationcompanyId = null


    			if(currentUser.roleids == '0'){  // super admin

		            installationcompanyId = null
		            companyId = null
		        }

		        if(currentUser.roleids == '1'){ // admin 
		        	companyId = null
		            installationcompanyId = currentUser.companyId

		        }

		         if(currentUser.roleids == '3'){ // user 
		        	companyId = currentUser.companyId
		            installationcompanyId = null

		        }
		        

		         Alarm.find_({companyId:companyId,installationcompanyId:installationcompanyId}).$promise.then(function(alarms) { 

                        console.log("alarms",alarms)

                        $scope.alarms = alarms.results

		         		$timeout(function(){
                            

                            $("#showalarms").dataTable({

                                retrieve: true,
                                aLengthMenu: [
                                    [ 25, 50, 100, -1], [ 25, 50, 100, "Tutti"]
                                ],
                                language: {
                                   info: "Mostra pagina _PAGE_ of _PAGES_",
                                   lengthMenu: "Mostra _MENU_ records per riga",
                                   paginate: {
                                                previous: "Indietro",
                                                next:"Avanti",
                                                first:"Prima pagina",
                                                last:"Ultima pagina"
                                               },
                                  search: "Cerca"
                                }
                            }).yadcf([

                                {column_number : 0 , filter_type: 'text',filter_default_label: "Aux"},
                                {column_number : 1, filter_type: 'text',filter_default_label: "Tipo Allarme"},
                                {column_number : 2, filter_type: 'text',filter_default_label: "Gateway"},
                                {column_number : 3, filter_type: 'text',filter_default_label: "Azienda"},
                                {column_number : 4, data: [{value:'true',label:'Attivo'},{value:'false',label:'Disattivato'}], filter_default_label: "Tutti"}
                                

                            ],{ filters_tr_index: true });
                        }, 50, false);



		         })  


    		})

        }



        $scope.switchalarmstatus = function(row){

            console.log("ROW SWITCH",row)


            Alarm.updateAttributes({id:row.id},row).$promise.then(function(alarm){               

                

                toastr.success("Stato Allarme aggiornato", "Avviso",opts);              

                             

        });
        }


}]);