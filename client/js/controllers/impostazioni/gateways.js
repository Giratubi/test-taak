angular.module('pdp',['angularFileUpload']).controller('gatewaysController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Gateway','$timeout',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Gateway,$timeout) {
               

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

    		Gateway.find().$promise.then(function(gat) { 

				console.log("gat",gat)
                 
                $scope.gateways = gat

              
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
						{column_number : 1, filter_type: 'text',filter_default_label: "Nome"}

					],{ filters_tr_index: true });
			    }, 150, false); 

			                     

            });
		}    	



    	$scope.editGatewaySettings = function(row){

				var inputs = {inputs:row}

	            ModalService.showModal({
	                  templateUrl: "../../../views/modals/associazionegateways.html",
	                  controllerjs:"js/controllers/modals/associazionegateways.js",
	                  controller: "associazioneGatewaysController",
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