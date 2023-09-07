angular.module('pdp',['angularFileUpload']).controller('connettoriController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Connector','$timeout',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Connector,$timeout) {
               

 		// opzioni del toaster
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

	    $scope.isdisabled = false;   // per il pulsante crea

	    initializate()


    	function initializate(){

    		Connector.find().$promise.then(function(con) { 
                 
                $scope.connectors = con

              
	            // paginatore e campo di ricerca della tabella

	           

                $timeout(function(){ 

					$("#showalarmtype").dataTable({

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
						{column_number : 0 , filter_type: 'text',filter_default_label: "Identificativo"},
						{column_number : 1, filter_type: 'text',filter_default_label: "Nome"},
						{column_number : 2, filter_type: 'text',filter_default_label: "Gateway"}

					],{ filters_tr_index: true });
			    }, 150, false); 

			                     

            });
		}    	



    	$scope.editConnectorSettings = function(row){

				var inputs = {inputs:row}

	            ModalService.showModal({
	                  templateUrl: "../../../views/modals/associazioneconnettori.html",
	                  controllerjs:"js/controllers/modals/associazioneconnettori.js",
	                  controller: "associazioneConnettoriController",
	                  inputs:inputs

	                }).then(function(modal)   {

	                    modal.element.modal();
	                    modal.close.then(function(result) { 

	                    initializate();	                   
	                                 
	                    
	                  }); 
	               }).catch(function(error) {
	               console.log(error);        
	              
	            });
					
					//toastr.error("So me by marianne admitted speaking.", "This is a title", opts);
		}


}]);