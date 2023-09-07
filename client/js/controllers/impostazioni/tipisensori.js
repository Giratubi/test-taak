angular.module('pdp',['angularFileUpload']).controller('tipiSensoriController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Sensortype','$timeout',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Sensortype,$timeout) {
               

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

    		Sensortype.find().$promise.then(function(sensortypes) { 
                 
                 $scope.sensortypes = sensortypes

              
	            // paginatore e campo di ricerca della tabella

	           

                $timeout(function(){ 

					$("#showsensortype").dataTable({

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
						{column_number : 0 , filter_type: 'text',filter_default_label: "Nome"},
						{column_number : 1, filter_type: 'text',filter_default_label: "Codice"},
						{column_number : 2, filter_type: 'text',filter_default_label: "Unità di misura"},
						{column_number : 3, filter_type: 'text',filter_default_label: "Descrizione"}

					],{ filters_tr_index: true });
			    }, 150, false); 

			                     

            });
		}


    	$scope.toggleIcon = function(){

    		$("#iconbtn").toggleClass("fa-plus fa-minus");
    	}


    	$scope.createSensorType = function(){    		


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


    		var filtercode = {where:{code:$scope.code}}

    		Sensortype.find({filter:filtercode}).$promise.then(function(sensortype) { 
               

                if(sensortype.length > 0){

                	 toastr.error("Il tipo sensore è già presente a sistema", "Avviso",opts);
                	 return;

                }else{

                	$scope.isdisabled = true;


		    		var obj = {
		        		name:$scope.name,
		        		code:$scope.code,
		        		unitmeasure:$scope.unitmeasure,		        		      		
		        		description: $scope.description,
		        		settings:$scope.settings
		        		
		        	}

		        	Sensortype.create(obj).$promise.then(function(sentyp){        		

		        		$scope.name = '';
		        		$scope.code = '';
		        		$scope.unitmeasure = '';		        		
		        		$scope.description = '';
		        		$scope.settings = '';
		        		

		        		toastr.success("Tipo sensore inserito correttamente", "Avviso",opts);      		

		        		$scope.isdisabled = false;

		        		initializate()

		        	});	

                }
                    

            });
        }

    	$scope.editSensorType = function(alarmtype){

				var inputs = {inputs:alarmtype}

	            ModalService.showModal({
	                  templateUrl: "../../../views/modals/dettaglitiposensore.html",
	                  controllerjs:"js/controllers/modals/dettaglitiposensore.js",
	                  controller: "dettagliTipoSensoreController",
	                  inputs:inputs

	                }).then(function(modal)   {

	                    modal.element.modal();
	                    modal.close.then(function(result) { 

	                    initializate();	
	                                 
	                    
	                  }); 
	               }).catch(function(error) {
	               console.log(error);        
	              
	            });					
					
		}


}]);